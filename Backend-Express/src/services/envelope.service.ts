import prisma from "../prisma/client";
import { TransactionType } from "@prisma/client";
import {
    AssignEnvelopeTransactionsDto,
    CreateEnvelopeDto,
    EnvelopeSummaryQueryDto,
    UpdateEnvelopeDto,
} from "../dto/envelope.dto";

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

export const createEnvelopeService = async (userId: number, dto: CreateEnvelopeDto) => {
    return prisma.envelope.create({
        data: {
            userId,
            name: dto.name.trim(),
            amount: dto.amount,
        },
    });
};

export const listEnvelopesService = (userId: number) => {
    return prisma.envelope.findMany({
        where: { userId },
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    });
};

export const getEnvelopeByIdService = (userId: number, id: number) => {
    return prisma.envelope.findFirst({
        where: { id, userId },
    });
};

export const updateEnvelopeService = async (userId: number, id: number, dto: UpdateEnvelopeDto) => {
    const existing = await prisma.envelope.findFirst({ where: { id, userId }, select: { id: true } });
    if (!existing) {
        const err: any = new Error("Envelope not found");
        err.statusCode = 404;
        throw err;
    }

    return prisma.envelope.update({
        where: { id },
        data: {
            ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
            ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
        },
    });
};

export const deleteEnvelopeService = async (userId: number, id: number) => {
    const existing = await prisma.envelope.findFirst({ where: { id, userId }, select: { id: true } });
    if (!existing) {
        const err: any = new Error("Envelope not found");
        err.statusCode = 404;
        throw err;
    }

    const txCount = await prisma.transaction.count({ where: { userId, envelopeId: id } });
    if (txCount > 0) {
        const err: any = new Error("Cannot delete an envelope that is used by transactions");
        err.statusCode = 409;
        throw err;
    }

    return prisma.envelope.delete({ where: { id } });
};

export const assignEnvelopeToTransactionsService = async (
    userId: number,
    envelopeId: number,
    dto: AssignEnvelopeTransactionsDto
) => {
    const env = await prisma.envelope.findFirst({ where: { id: envelopeId, userId }, select: { id: true } });
    if (!env) {
        const err: any = new Error("Envelope not found");
        err.statusCode = 404;
        throw err;
    }

    const tx = await prisma.transaction.findMany({
        where: { userId, id: { in: dto.transactionIds } },
        select: { id: true },
    });

    const found = new Set(tx.map((t) => t.id));
    const missing = dto.transactionIds.filter((id) => !found.has(id));
    if (missing.length > 0) {
        const err: any = new Error(`Some transactions were not found: ${missing.join(", ")}`);
        err.statusCode = 404;
        throw err;
    }

    await prisma.transaction.updateMany({
        where: { userId, id: { in: dto.transactionIds } },
        data: { envelopeId },
    });

    return getEnvelopeByIdService(userId, envelopeId);
};

export const getEnvelopeSummaryService = async (userId: number, envelopeId: number, q: EnvelopeSummaryQueryDto) => {
    const env = await prisma.envelope.findFirst({ where: { id: envelopeId, userId } });
    if (!env) {
        const err: any = new Error("Envelope not found");
        err.statusCode = 404;
        throw err;
    }

    const from = q.from ? new Date(q.from) : new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1, 0, 0, 0, 0));
    const to = q.to ? new Date(q.to) : new Date();

    assertRangeValid(from, to);

    const [incomeAgg, expenseAgg] = await Promise.all([
        prisma.transaction.aggregate({
            where: {
                userId,
                envelopeId,
                type: TransactionType.INCOME,
                date: { gte: from, lte: to },
            },
            _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
            where: {
                userId,
                envelopeId,
                type: TransactionType.EXPENSE,
                date: { gte: from, lte: to },
            },
            _sum: { amount: true },
        }),
    ]);

    const income = incomeAgg._sum.amount ?? 0;
    const expense = expenseAgg._sum.amount ?? 0;
    const net = income - expense;

    return {
        envelope: {
            id: env.id,
            name: env.name,
            plannedAmount: env.amount,
        },
        period: { from, to },
        totals: { income, expense, net },
    };
};
