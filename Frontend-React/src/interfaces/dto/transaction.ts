import type { Schedule, TransactionType } from "./schedules"

export interface GetFitlerTransaction {
  from?: string
  to?: string
  type?: TransactionType
  categoryId?: number
  budgetId?: number
  envelopeId?: number
  groupId?: number
  scheduleId?: number
  page?: number
  pageSize?: number
}

export interface PutTransaction {
  paymentStatus?: boolean;
}

export interface Transaction {
  id: number;
  userId: number;
  amount: number;
  type: TransactionType;
  date: string;
  description?: string | null;
  paymentStatus: boolean;
  categoryId: number;
  budgetId?: number | null;
  envelopeId?: number | null;
  scheduleId?: number | null;
  schedule?: Schedule
  occurrenceDate?: string | null;
  createdAt: string;
  updatedAt: string;
}