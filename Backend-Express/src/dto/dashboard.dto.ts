import { IsDateString, IsOptional, Matches } from "class-validator";

export class DashboardMonthlyQueryDto {
    @IsOptional()
    @Matches(/^\d{4}-\d{2}$/, { message: "month must be in format YYYY-MM" })
    month?: string;

    @IsOptional()
    @IsDateString({}, { message: "from must be a valid ISO date" })
    from?: string;

    @IsOptional()
    @IsDateString({}, { message: "to must be a valid ISO date" })
    to?: string;
}
