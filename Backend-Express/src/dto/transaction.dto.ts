import { Type } from "class-transformer";
import {
    IsBoolean,
    IsDateString,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    Min,
} from "class-validator";
import { TransactionType } from "@prisma/client";

export class CreateTransactionDto {
    @IsNumber()
    @IsPositive()
    amount!: number;

    @IsEnum(TransactionType)
    type!: TransactionType;

    @IsDateString()
    date!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @Type(() => Number)
    @IsInt()
    categoryId!: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    budgetId?: number | null;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    envelopeId?: number | null;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    groupId?: number | null;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    scheduleId?: number | null;

    @IsOptional()
    @IsBoolean()
    paymentStatus?: boolean;
}

export class UpdateTransactionDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    amount?: number;

    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    budgetId?: number | null;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    envelopeId?: number | null;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    groupId?: number | null;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    scheduleId?: number | null;

    @IsOptional()
    @IsBoolean()
    paymentStatus?: boolean;
}

export class ListTransactionsQueryDto {
    @IsOptional()
    @IsDateString()
    from?: string;

    @IsOptional()
    @IsDateString()
    to?: string;

    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    budgetId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    envelopeId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    groupId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    scheduleId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(200)
    pageSize?: number = 20;
}
