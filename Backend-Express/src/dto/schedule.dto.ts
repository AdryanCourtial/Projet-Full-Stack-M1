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
    MaxLength,
    Min,
} from "class-validator";
import { ScheduleFrequency, TransactionType } from "@prisma/client";

export class CreateScheduleDto {
    @IsString()
    @MaxLength(120)
    name!: string;

    @IsNumber()
    @IsPositive()
    amount!: number;

    @IsEnum(TransactionType)
    type!: TransactionType;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    categoryId!: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    budgetId?: number | null;

    @IsOptional()
    @IsEnum(ScheduleFrequency)
    frequency?: ScheduleFrequency;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    customInterval?: number = 1;

    @IsDateString()
    startDate!: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;
}

export class UpdateScheduleDto {
    @IsOptional()
    @IsString()
    @MaxLength(120)
    name?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    amount?: number;

    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    categoryId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    budgetId?: number | null;

    @IsOptional()
    @IsEnum(ScheduleFrequency)
    frequency?: ScheduleFrequency;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    customInterval?: number;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class RunScheduleQueryDto {
    @IsOptional()
    @IsDateString({}, { message: "to must be a valid ISO date" })
    to?: string;
}
