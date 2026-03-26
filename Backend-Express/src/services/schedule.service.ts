import prisma from "../prisma/client";
import { Prisma, ScheduleFrequency, TransactionType } from "@prisma/client";
import {
  CreateScheduleDto,
  RunScheduleQueryDto,
  UpdateScheduleDto,
} from "../dto/schedule.dto";
import { getCurrentMonthInfo } from "../utils/utils";

const toUTCDateOnly = (d: Date) =>
  new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
  );

const assertRangeValid = (from: Date, to: Date) => {
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    const err: any = new Error("Invalid date range");
    err.statusCode = 400;
    throw err;
  }
  if (from > to) {
    const err: any = new Error("startDate must be <= endDate/to");
    err.statusCode = 400;
    throw err;
  }
};

const daysInMonthUTC = (year: number, monthIndex0: number) =>
  new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();

const addMonthsClampedUTC = (date: Date, monthsToAdd: number) => {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();

  const targetMonth = m + monthsToAdd;
  const targetYear = y + Math.floor(targetMonth / 12);
  const targetMonthIndex = ((targetMonth % 12) + 12) % 12;

  const dim = daysInMonthUTC(targetYear, targetMonthIndex);
  const clampedDay = Math.min(d, dim);

  return new Date(
    Date.UTC(targetYear, targetMonthIndex, clampedDay, 0, 0, 0, 0),
  );
};

const nextOccurrenceUTC = (
  current: Date,
  frequency: ScheduleFrequency,
  interval: number,
) => {
  switch (frequency) {
    case ScheduleFrequency.DAILY:
      return new Date(
        Date.UTC(
          current.getUTCFullYear(),
          current.getUTCMonth(),
          current.getUTCDate() + interval,
          0,
          0,
          0,
          0,
        ),
      );
    case ScheduleFrequency.WEEKLY:
      return new Date(
        Date.UTC(
          current.getUTCFullYear(),
          current.getUTCMonth(),
          current.getUTCDate() + 7 * interval,
          0,
          0,
          0,
          0,
        ),
      );
    case ScheduleFrequency.MONTHLY:
      return addMonthsClampedUTC(current, interval);
    case ScheduleFrequency.YEARLY:
      return addMonthsClampedUTC(current, 12 * interval);
    default:
      return new Date(
        Date.UTC(
          current.getUTCFullYear(),
          current.getUTCMonth(),
          current.getUTCDate() + interval,
          0,
          0,
          0,
          0,
        ),
      );
  }
};

const monthBoundsUTC = (reference: Date) => {
  const y = reference.getUTCFullYear();
  const m = reference.getUTCMonth();

  const from = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
  const to = new Date(Date.UTC(y, m, daysInMonthUTC(y, m), 0, 0, 0, 0));

  return { from, to };
};

type RunnableSchedule = {
  id: number;
  userId: number;
  name: string;
  amount: number;
  type: TransactionType;
  categoryId: number;
  budgetId: number | null;
  frequency: ScheduleFrequency | null;
  customInterval: number | null;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
};

const executeScheduleUntil = async (
  schedule: RunnableSchedule,
  toDate: Date,
) => {
  const to = toUTCDateOnly(toDate);
  const start = toUTCDateOnly(schedule.startDate);
  const end = schedule.endDate ? toUTCDateOnly(schedule.endDate) : null;

  const effectiveTo = end ? (to < end ? to : end) : to;
  assertRangeValid(start, effectiveTo);

  const freq = schedule.frequency ?? ScheduleFrequency.MONTHLY;
  const interval = schedule.customInterval ?? 1;

  const last = await prisma.transaction.findFirst({
    where: {
      userId: schedule.userId,
      scheduleId: schedule.id,
      occurrenceDate: { not: null },
    },
    orderBy: { occurrenceDate: "desc" },
    select: { occurrenceDate: true },
  });

  let current = last?.occurrenceDate
    ? nextOccurrenceUTC(toUTCDateOnly(last.occurrenceDate), freq, interval)
    : start;

  const createdIds: number[] = [];
  let attempted = 0;

  while (current <= effectiveTo) {
    attempted++;

    try {
      const tx = await prisma.transaction.create({
        data: {
          userId: schedule.userId,
          amount: schedule.amount,
          type: schedule.type,
          date: current,
          occurrenceDate: current,
          description: schedule.name,
          categoryId: schedule.categoryId,
          budgetId: schedule.budgetId,
          scheduleId: schedule.id,
          paymentStatus: false,
        },
        select: { id: true },
      });

      createdIds.push(tx.id);
    } catch (e: any) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
      } else {
        throw e;
      }
    }

    current = nextOccurrenceUTC(current, freq, interval);
  }

  return {
    scheduleId: schedule.id,
    attempted,
    created: createdIds.length,
    createdIds,
    to: effectiveTo,
  };
};

export const createScheduleService = async (
  userId: number,
  dto: CreateScheduleDto,
) => {
  const startDate = toUTCDateOnly(new Date(dto.startDate));
  const endDate = dto.endDate ? toUTCDateOnly(new Date(dto.endDate)) : null;
  if (endDate) assertRangeValid(startDate, endDate);

  const freq = dto.frequency ?? ScheduleFrequency.MONTHLY;
  const interval = dto.customInterval ?? 1;

    const category = await prisma.category.findFirst({
        where: { id: dto.categoryId },
    });

    if (!category) {
        const err: any = new Error("Category not found");
        err.statusCode = 404;
        throw err;
    }

  if (dto.budgetId) {
    const budget = await prisma.budget.findFirst({
      where: { id: dto.budgetId, userId },
      select: { id: true },
    });
    if (!budget) {
      const err: any = new Error("Budget not found");
      err.statusCode = 404;
      throw err;
    }
  }

  return prisma.schedule.create({
    data: {
      userId,
      name: dto.name.trim(),
      amount: dto.amount,
      type: dto.type,
      categoryId: dto.categoryId,
      budgetId: dto.budgetId ?? null,
      frequency: freq,
      customInterval: interval,
      startDate,
      endDate,
      isActive: dto.isActive ?? true,
    },
    include: { category: true, budget: true },
  });
};

export const listSchedulesService = (userId: number) => {
  return prisma.schedule.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    include: { category: true, budget: true },
  });
};

export const getScheduleByIdService = (userId: number, id: number) => {
  return prisma.schedule.findFirst({
    where: { id, userId },
    include: { category: true, budget: true },
  });
};

export const updateScheduleService = async (
  userId: number,
  id: number,
  dto: UpdateScheduleDto,
) => {
  const existing = await prisma.schedule.findFirst({
    where: { id, userId },
    select: {
      id: true,
      type: true,
      categoryId: true,
      startDate: true,
      endDate: true,
    },
  });
  if (!existing) {
    const err: any = new Error("Schedule not found");
    err.statusCode = 404;
    throw err;
  }

  const nextCategoryId = dto.categoryId ?? existing.categoryId;

  if (dto.categoryId !== undefined) {
    const category = await prisma.category.findFirst({
      where: { id: nextCategoryId, userId },
      select: { id: true },
    });
    if (!category) {
      const err: any = new Error("Category not found");
      err.statusCode = 404;
      throw err;
    }
  }

  if (dto.budgetId) {
    const budget = await prisma.budget.findFirst({
      where: { id: dto.budgetId, userId },
      select: { id: true },
    });
    if (!budget) {
      const err: any = new Error("Budget not found");
      err.statusCode = 404;
      throw err;
    }
  }

  const nextStart = dto.startDate
    ? toUTCDateOnly(new Date(dto.startDate))
    : existing.startDate;
  const nextEnd =
    dto.endDate !== undefined
      ? dto.endDate
        ? toUTCDateOnly(new Date(dto.endDate))
        : null
      : existing.endDate;

  if (nextEnd) assertRangeValid(nextStart, nextEnd);

  return prisma.schedule.update({
    where: { id },
    data: {
      ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
      ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
      ...(dto.budgetId !== undefined ? { budgetId: dto.budgetId } : {}),
      ...(dto.frequency !== undefined ? { frequency: dto.frequency } : {}),
      ...(dto.customInterval !== undefined
        ? { customInterval: dto.customInterval }
        : {}),
      ...(dto.startDate !== undefined ? { startDate: nextStart } : {}),
      ...(dto.endDate !== undefined ? { endDate: nextEnd } : {}),
      ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
    },
    include: { category: true, budget: true },
  });
};

export const deleteScheduleService = async (userId: number, id: number) => {
  const existing = await prisma.schedule.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!existing) {
    const err: any = new Error("Schedule not found");
    err.statusCode = 404;
    throw err;
  }
  return prisma.schedule.delete({ where: { id } });
};

export const runScheduleService = async (
  userId: number,
  scheduleId: number,
  q: RunScheduleQueryDto,
) => {
  const schedule = await prisma.schedule.findFirst({
    where: { id: scheduleId, userId },
    select: {
      id: true,
      userId: true,
      name: true,
      amount: true,
      type: true,
      categoryId: true,
      budgetId: true,
      frequency: true,
      customInterval: true,
      startDate: true,
      endDate: true,
      isActive: true,
    },
  });
  if (!schedule) {
    const err: any = new Error("Schedule not found");
    err.statusCode = 404;
    throw err;
  }
  if (!schedule.isActive) {
    const err: any = new Error("Schedule is inactive");
    err.statusCode = 409;
    throw err;
  }

  const to = q.to ? toUTCDateOnly(new Date(q.to)) : toUTCDateOnly(new Date());
  return executeScheduleUntil(schedule, to);
};

export const runSchedulesForCurrentMonthService = async (
  referenceDate: Date = new Date(),
) => {
  const month = monthBoundsUTC(referenceDate);

  const schedules = await prisma.schedule.findMany({
    where: {
      isActive: true,
      startDate: { lte: month.to },
      OR: [{ endDate: null }, { endDate: { gte: month.from } }],
    },
    select: {
      id: true,
      userId: true,
      name: true,
      amount: true,
      type: true,
      categoryId: true,
      budgetId: true,
      frequency: true,
      customInterval: true,
      startDate: true,
      endDate: true,
      isActive: true,
    },
    orderBy: [{ userId: "asc" }, { id: "asc" }],
  });

  const results: Array<{
    scheduleId: number;
    attempted: number;
    created: number;
    createdIds: number[];
    to: Date;
  }> = [];

  for (const schedule of schedules) {
    const result = await executeScheduleUntil(schedule, month.to);
    results.push(result);
  }

  const attempted = results.reduce((acc, cur) => acc + cur.attempted, 0);
  const created = results.reduce((acc, cur) => acc + cur.created, 0);

  return {
    monthStart: month.from,
    monthEnd: month.to,
    totalSchedules: schedules.length,
    attempted,
    created,
    results,
  };
};
