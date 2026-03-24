import {
  CreateTransactionDto,
  ListTransactionsQueryDto,
  UpdateTransactionDto,
} from "../dto/transaction.dto";
import prisma from "../prisma/client";

export const createTransactionService = async (
  userId: number,
  dto: CreateTransactionDto,
) => {
  // 1) Category ownership check
  const category = await prisma.category.findFirst({
    where: { id: dto.categoryId, userId },
    select: { id: true },
  });

  if (!category) {
    const err: any = new Error("Category not found");
    err.statusCode = 404;
    throw err;
  }

  // 2) Budget check (si fourni)
  let budgetGroupId: number | null = null;

  if (dto.budgetId) {
    const budget = await prisma.budget.findFirst({
      where: { id: dto.budgetId },
      select: { id: true, userId: true, groupId: true },
    });

    if (!budget) {
      const err: any = new Error("Budget not found");
      err.statusCode = 404;
      throw err;
    }

    budgetGroupId = budget.groupId ?? null;

    // Accès budget perso
    if (!budgetGroupId) {
      if (budget.userId !== userId) {
        const err: any = new Error("Access denied to budget");
        err.statusCode = 403;
        throw err;
      }
    } else {
      // Accès budget de groupe (membre/owner)
      const canAccess = await prisma.group.findFirst({
        where: {
          id: budgetGroupId,
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: { id: true },
      });

      if (!canAccess) {
        const err: any = new Error("Access denied to group budget");
        err.statusCode = 403;
        throw err;
      }
    }
  }

  // 3) Envelope ownership check (si fourni)
  if (dto.envelopeId) {
    const env = await prisma.envelope.findFirst({
      where: { id: dto.envelopeId, userId },
      select: { id: true },
    });

    if (!env) {
      const err: any = new Error("Envelope not found");
      err.statusCode = 404;
      throw err;
    }
  }

  // 4) Schedule:
  if ((dto as any).scheduleId) {
    const schedule = await prisma.schedule.findFirst({
      where: { id: (dto as any).scheduleId, userId },
      select: { id: true },
    });

    if (!schedule) {
      const err: any = new Error("Schedule not found");
      err.statusCode = 404;
      throw err;
    }
  }

  // 5) Création
  return prisma.transaction.create({
    data: {
      userId,
      amount: dto.amount,
      type: dto.type,
      date: new Date(dto.date),
      description: dto.description?.trim() || null,
      categoryId: dto.categoryId,

      budgetId: dto.budgetId ?? null,
      envelopeId: dto.envelopeId ?? null,

      paymentStatus: dto.paymentStatus ?? false,
    },
    include: { category: true, budget: true },
  });
};

export const getTransactionByIdService = (userId: number, id: number) => {
  return prisma.transaction.findFirst({
    where: { id, userId },
    include: { category: true },
  });
};

export const listTransactionsService = async (
  userId: number,
  q: ListTransactionsQueryDto,
) => {
  const where: any = { userId };

  if (q.type) where.type = q.type;
  if (q.categoryId) where.categoryId = q.categoryId;
  if (q.budgetId) where.budgetId = q.budgetId;
  if (q.envelopeId) where.envelopeId = q.envelopeId;
  if (q.groupId) where.groupId = q.groupId;
  if (q.scheduleId) where.scheduleId = q.scheduleId;

  if (q.from || q.to) {
    where.date = {};
    if (q.from) where.date.gte = new Date(q.from);
    if (q.to) where.date.lte = new Date(q.to);
  }

  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 20;

  const [total, items] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      orderBy: [{ date: "desc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true },
    }),
  ]);

  return { items, page, pageSize, total };
};

export const updateTransactionService = async (
  userId: number,
  id: number,
  dto: UpdateTransactionDto,
) => {
  const existing = await prisma.transaction.findFirst({
    where: { id, userId },
    select: { id: true, type: true, categoryId: true },
  });
  if (!existing) {
    const err: any = new Error("Transaction not found");
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

  return prisma.transaction.update({
    where: { id },
    data: {
      ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.date !== undefined ? { date: new Date(dto.date) } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description.trim() || null }
        : {}),
      ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),

      ...(dto.budgetId !== undefined ? { budgetId: dto.budgetId } : {}),
      ...(dto.envelopeId !== undefined ? { envelopeId: dto.envelopeId } : {}),
      ...(dto.scheduleId !== undefined ? { scheduleId: dto.scheduleId } : {}),
      ...(dto.paymentStatus !== undefined
        ? { paymentStatus: dto.paymentStatus }
        : {}),
    },
    include: { category: true },
  });
};

export const deleteTransactionService = (id: number) => {
  return prisma.transaction.delete({ where: { id } });
};
