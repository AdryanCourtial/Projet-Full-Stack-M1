// src/services/dashboard.service.ts
import prisma from "../prisma/client";
import { Prisma, TransactionType } from "@prisma/client";
import { DashboardMonthlyQueryDto } from "../dto/dashboard.dto";

type Period = { from: Date; to: Date };

const getMonthPeriodUTC = (month: string): Period => {
    const [yStr, mStr] = month.split("-");
    const year = Number(yStr);
    const monthIndex = Number(mStr) - 1;

    if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
        const err: any = new Error("Invalid month");
        err.statusCode = 400;
        throw err;
    }

    const from = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
    const to = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

    return { from, to };
};

const getRangePeriod = (from?: string, to?: string): Period => {
    if (!from || !to) {
        const err: any = new Error("from and to are required together (or use month=YYYY-MM)");
        err.statusCode = 400;
        throw err;
    }
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
        const err: any = new Error("Invalid date range");
        err.statusCode = 400;
        throw err;
    }
    if (fromDate > toDate) {
        const err: any = new Error("from must be <= to");
        err.statusCode = 400;
        throw err;
    }

    return { from: fromDate, to: toDate };
};

const daysBetweenInclusiveUTC = (from: Date, to: Date) => {
    const f = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
    const t = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((t - f) / msPerDay) + 1;
};

const formatYYYYMMDD = (d: Date) => {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

export const getMonthlyDashboardService = async (userId: number, q: DashboardMonthlyQueryDto) => {
    const hasMonth = !!q.month;
    const hasRange = !!(q.from || q.to);

    if (hasMonth && hasRange) {
        const err: any = new Error("Use either month=YYYY-MM or from/to (not both)");
        err.statusCode = 400;
        throw err;
    }

    const period = hasMonth ? getMonthPeriodUTC(q.month!) : getRangePeriod(q.from, q.to);

    const whereBase = {
        userId,
        date: { gte: period.from, lte: period.to },
    } as const;

    const [incomeAgg, expenseAgg] = await Promise.all([
        prisma.transaction.aggregate({
            where: { ...whereBase, type: TransactionType.INCOME },
            _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
            where: { ...whereBase, type: TransactionType.EXPENSE },
            _sum: { amount: true },
        }),
    ]);

    const totalIncome = incomeAgg._sum.amount ?? 0;
    const totalExpense = expenseAgg._sum.amount ?? 0;
    const net = totalIncome - totalExpense;

    const top = await prisma.transaction.groupBy({
        by: ["categoryId"],
        where: { ...whereBase, type: TransactionType.EXPENSE },
        _sum: { amount: true },
        orderBy: { _sum: { amount: "desc" } },
        take: 10,
    });

    const topCategoryIds = top.map((t) => t.categoryId);
    const categories = topCategoryIds.length
        ? await prisma.category.findMany({
            where: { userId, id: { in: topCategoryIds } },
            select: { id: true, name: true },
        })
        : [];

    const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
    const topExpenseCategories = top.map((t) => ({
        categoryId: t.categoryId,
        name: categoryNameById.get(t.categoryId) ?? "Unknown",
        total: t._sum.amount ?? 0,
    }));

    const dailyRows = await prisma.$queryRaw<
        Array<{ day: string; income: any; expense: any }>
    >(Prisma.sql`
    SELECT
        DATE_FORMAT(\`date\`, '%Y-%m-%d') AS day,
        SUM(CASE WHEN \`type\` = 'INCOME' THEN \`amount\` ELSE 0 END) AS income,
        SUM(CASE WHEN \`type\` = 'EXPENSE' THEN \`amount\` ELSE 0 END) AS expense
    FROM \`Transaction\`
    WHERE \`userId\` = ${userId}
        AND \`date\` BETWEEN ${period.from} AND ${period.to}
    GROUP BY DATE_FORMAT(\`date\`, '%Y-%m-%d')
    ORDER BY day ASC
    `);


    const dailyMap = new Map<string, { income: number; expense: number }>();
    for (const r of dailyRows) {
        const income = typeof r.income === "number" ? r.income : Number(r.income);
        const expense = typeof r.expense === "number" ? r.expense : Number(r.expense);
        dailyMap.set(r.day, { income: Number.isFinite(income) ? income : 0, expense: Number.isFinite(expense) ? expense : 0 });
    }

    const daysCount = daysBetweenInclusiveUTC(period.from, period.to);
    const dailySeries: Array<{ date: string; income: number; expense: number }> = [];

    for (let i = 0; i < daysCount; i++) {
        const d = new Date(Date.UTC(period.from.getUTCFullYear(), period.from.getUTCMonth(), period.from.getUTCDate() + i));
        const key = formatYYYYMMDD(d);
        const row = dailyMap.get(key) ?? { income: 0, expense: 0 };
        dailySeries.push({ date: key, income: row.income, expense: row.expense });
    }

    const avgDailyExpense = daysCount > 0 ? totalExpense / daysCount : 0;

    return {
        period: {
            from: formatYYYYMMDD(period.from),
            to: formatYYYYMMDD(period.to),
        },
        totals: {
            income: totalIncome,
            expense: totalExpense,
            net,
        },
        avgDailyExpense,
        topExpenseCategories,
        dailySeries,
    };
};
