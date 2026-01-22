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

export class CreateEnvelopeDto {
    @IsString()
    @MaxLength(100)
    name!: string;

    @IsNumber()
    @IsPositive()
    amount!: number;
}

export class UpdateEnvelopeDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    amount?: number;
}

export class EnvelopeSummaryQueryDto {
    @IsOptional()
    @IsDateString({}, { message: "from must be a valid ISO date" })
    from?: string;

    @IsOptional()
    @IsDateString({}, { message: "to must be a valid ISO date" })
    to?: string;
}

export class AssignEnvelopeTransactionsDto {
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    @IsInt({ each: true })
    @Min(1, { each: true })
    transactionIds!: number[];
}
