export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    password_confirmation: string;
}