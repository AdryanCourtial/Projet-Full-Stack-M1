import type { User } from "../authentification";
import type { Budget } from "./budget";
import type { Category } from "./category";

export interface PostScheduleDto {
    name: string;
    amount: number;
    type: TransactionType;
    categoryId: number;
    budgetId?: number | null;
    frequency?: ScheduleFrequency;
    customInterval?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

export interface Schedule {
    amount: number
    budget?: Budget
    budgetId: number
    category?: Category
    categoryId: number
    createdAt: Date
    customInterval: number
    endDate: string | null
    frequency: ScheduleFrequency
    id: number
    isActive: boolean
    name: string
    startDate: string
    type: TransactionType
    updatedAt: Date
    userId: number
    user?: User
}

export type TransactionType = "INCOME" | "EXPENSE"

export enum ScheduleFrequency {
    // DAILY = "DAILY",
    // WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY",
}