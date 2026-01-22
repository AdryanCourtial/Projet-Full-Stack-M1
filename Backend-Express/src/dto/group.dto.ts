import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateGroupDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
}

export class AddGroupMemberDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    userId!: number;
}
