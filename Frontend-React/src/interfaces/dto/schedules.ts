export interface PostScheduleDto {
    name: string;
    amount: number;
    type: TransactionType;
    categoryId: number;
    budgetId?: number | null;
    frequency?: ScheduleFrequency;
    customInterval?: number;
    startDate: string;
    endDate?: string;
    isActive?: boolean;
}

type TransactionType = "INCOME" | "EXPENSE"

export enum ScheduleFrequency {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY",
}