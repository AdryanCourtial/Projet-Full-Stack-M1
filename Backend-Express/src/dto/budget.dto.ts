import { Type } from "class-transformer";
import {
    ArrayNotEmpty,
    IsArray,
    IsDateString,
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    Min,
} from "class-validator";

export class CreateBudgetDto {
    @IsString()
    @MaxLength(100)
    name!: string;

    @IsNumber()
    @IsPositive()
    amountPlanned!: number;

    @IsDateString()
    startDate!: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    groupId?: number;
}

export class UpdateBudgetDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    amountPlanned?: number;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}

export class AddBudgetCategoriesDto {
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    @IsInt({ each: true })
    @Min(1, { each: true })
    categoryIds!: number[];
}

export class BudgetSummaryQueryDto {
    @IsOptional()
    @IsDateString({}, { message: "from must be a valid ISO date" })
    from?: string;

    @IsOptional()
    @IsDateString({}, { message: "to must be a valid ISO date" })
    to?: string;
}
