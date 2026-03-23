import { IsOptional, IsString } from "class-validator";

export class UserDto {
  @IsOptional()
  @IsString()
  q?: string;
}
