// src/services/budget.service.ts
import prisma from "../prisma/client";
import { TransactionType } from "@prisma/client";
import {
  AddBudgetCategoriesDto,
  BudgetSummaryQueryDto,
  CreateBudgetDto,
  UpdateBudgetDto,
} from "../dto/budget.dto";

const assertRangeValid = (from: Date, to: Date) => {
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    const err: any = new Error("Invalid date range");
    err.statusCode = 400;
    throw err;
  }
  if (from > to) {
    const err: any = new Error("from must be <= to");
    err.statusCode = 400;
    throw err;
  }
};

export const createBudgetService = async (
  userId: number,
  dto: CreateBudgetDto,
) => {
  const startDate = new Date(dto.startDate);
  const endDate = dto.endDate ? new Date(dto.endDate) : null;

  if (endDate) assertRangeValid(startDate, endDate);

  // 🔒 Si budget de groupe, on valide le groupe
  if (dto.groupId) {
    const group = await prisma.group.findFirst({
      where: {
        id: dto.groupId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: { id: true },
    });

    if (!group) {
      const err: any = new Error("Group not found or access denied");
      err.statusCode = 403;
      throw err;
    }
  }

  return prisma.budget.create({
    data: {
      userId,
      groupId: dto.groupId ?? null,
      name: dto.name.trim(),
      amountPlanned: dto.amountPlanned,
      startDate,
      endDate,
    },
  });
};

export const listBudgetsService = (userId: number) => {
  return prisma.budget.findMany({
    where: budgetAccessWhere(userId),
    orderBy: [{ startDate: "desc" }, { id: "desc" }],
    include: {
      group: { select: { id: true, name: true, ownerId: true } },
    },
  });
};

export const getBudgetByIdService = (userId: number, id: number) => {
  return prisma.budget.findFirst({
    where: {
      id,
      ...budgetAccessWhere(userId),
    },
    include: {
      group: { select: { id: true, name: true, ownerId: true } },
      budgetCategories: { include: { category: true } },
    },
  });
};

export const updateBudgetService = async (
  userId: number,
  id: number,
  dto: UpdateBudgetDto,
) => {
  const existing = await prisma.budget.findFirst({
    where: { id, userId },
    select: { id: true, startDate: true, endDate: true },
  });
  if (!existing) {
    const err: any = new Error("Budget not found");
    err.statusCode = 404;
    throw err;
  }

  const nextStart = dto.startDate
    ? new Date(dto.startDate)
    : existing.startDate;
  const nextEnd =
    dto.endDate !== undefined
      ? dto.endDate
        ? new Date(dto.endDate)
        : null
      : existing.endDate;

  if (nextEnd) assertRangeValid(nextStart, nextEnd);

  return prisma.budget.update({
    where: { id },
    data: {
      ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
      ...(dto.amountPlanned !== undefined
        ? { amountPlanned: dto.amountPlanned }
        : {}),
      ...(dto.startDate !== undefined ? { startDate: nextStart } : {}),
      ...(dto.endDate !== undefined ? { endDate: nextEnd } : {}),
    },
  });
};

export const deleteBudgetService = async (userId: number, id: number) => {
  const existing = await prisma.budget.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!existing) {
    const err: any = new Error("Budget not found");
    err.statusCode = 404;
    throw err;
  }

  const txCount = await prisma.transaction.count({
    where: { userId, budgetId: id },
  });
  if (txCount > 0) {
    const err: any = new Error(
      "Cannot delete a budget that is used by transactions",
    );
    err.statusCode = 409;
    throw err;
  }

  return prisma.budget.delete({ where: { id } });
};

export const addBudgetCategoriesService = async (
  userId: number,
  budgetId: number,
  dto: AddBudgetCategoriesDto,
) => {
  const budget = await prisma.budget.findFirst({
    where: { id: budgetId, userId },
    select: { id: true },
  });
  if (!budget) {
    const err: any = new Error("Budget not found");
    err.statusCode = 404;
    throw err;
  }

  const cats = await prisma.category.findMany({
    where: { userId, id: { in: dto.categoryIds } },
    select: { id: true },
  });

  const found = new Set(cats.map((c) => c.id));
  const missing = dto.categoryIds.filter((id) => !found.has(id));
  if (missing.length > 0) {
    const err: any = new Error(
      `Some categories were not found: ${missing.join(", ")}`,
    );
    err.statusCode = 404;
    throw err;
  }

  await prisma.budgetCategory.createMany({
    data: dto.categoryIds.map((categoryId) => ({ budgetId, categoryId })),
    skipDuplicates: true,
  });

  return getBudgetByIdService(userId, budgetId);
};

export const removeBudgetCategoryService = async (
  userId: number,
  budgetId: number,
  categoryId: number,
) => {
  const budget = await prisma.budget.findFirst({
    where: { id: budgetId, userId },
    select: { id: true },
  });
  if (!budget) {
    const err: any = new Error("Budget not found");
    err.statusCode = 404;
    throw err;
  }

  const bc = await prisma.budgetCategory.findFirst({
    where: { budgetId, categoryId },
    select: { id: true },
  });

  if (!bc) {
    const err: any = new Error("Budget category link not found");
    err.statusCode = 404;
    throw err;
  }

  await prisma.budgetCategory.delete({ where: { id: bc.id } });
  return getBudgetByIdService(userId, budgetId);
};

export const getBudgetSummaryService = async (
  userId: number,
  budgetId: number,
  q: BudgetSummaryQueryDto,
) => {
  const budget = await prisma.budget.findFirst({
    where: {
      id: budgetId,
      ...budgetAccessWhere(userId),
    },
    include: {
      group: { select: { id: true, name: true, ownerId: true } },
      budgetCategories: {
        include: { category: { select: { id: true, name: true } } },
      },
    },
  });

  if (!budget) {
    const err: any = new Error("Budget not found");
    err.statusCode = 404;
    throw err;
  }

  const from = q.from ? new Date(q.from) : budget.startDate;
  const to = q.to ? new Date(q.to) : (budget.endDate ?? new Date());
  assertRangeValid(from, to);

  const spentAgg = await prisma.transaction.aggregate({
    where: {
      budgetId,
      type: TransactionType.EXPENSE,
      date: { gte: from, lte: to },
    },
    _sum: { amount: true },
  });

  const incomeAgg = await prisma.transaction.aggregate({
    where: {
      budgetId,
      type: TransactionType.INCOME,
      date: { gte: from, lte: to },
    },
    _sum: { amount: true },
  });

  const spent = spentAgg._sum.amount ?? 0;
  const income = incomeAgg._sum.amount ?? 0;

  const planned = budget.amountPlanned;
  const remaining = planned - spent;

  const breakdown = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      budgetId,
      type: TransactionType.EXPENSE,
      date: { gte: from, lte: to },
    },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  const categoryIds = breakdown.map((b) => b.categoryId);
  const categories = categoryIds.length
    ? await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true },
      })
    : [];

  const nameById = new Map(categories.map((c) => [c.id, c.name]));
  const byCategory = breakdown.map((b) => ({
    categoryId: b.categoryId,
    name: nameById.get(b.categoryId) ?? "Unknown",
    spent: b._sum.amount ?? 0,
  }));

  return {
    budget: {
      id: budget.id,
      name: budget.name,
      amountPlanned: budget.amountPlanned,
      startDate: budget.startDate,
      endDate: budget.endDate,
      group: budget.group
        ? {
            id: budget.group.id,
            name: budget.group.name,
            ownerId: budget.group.ownerId,
          }
        : null,
    },
    period: { from, to },
    totals: { planned, income, spent, remaining, net: income - spent },
    byCategory,
    attachedCategories: budget.budgetCategories.map((bc) => ({
      id: bc.category.id,
      name: bc.category.name,
    })),
  };
};

const budgetAccessWhere = (userId: number) => ({
  OR: [
    // budget perso
    { userId, groupId: null },
    // budget de groupe
    {
      group: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
    },
  ],
});
