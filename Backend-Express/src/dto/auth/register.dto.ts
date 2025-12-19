import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    username!: string;

    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    @MinLength(6)
    password_confirmation!: string;
}
