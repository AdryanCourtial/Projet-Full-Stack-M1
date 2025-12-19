import prisma from "../prisma/client"
import { CreateUserInput } from "../types/user";
import bcrypt from "bcrypt";

// Service to get all users from the database
export const getAllUsersService = () => {
    return prisma.user.findMany();
}

// Service to get a user by ID from the database
export const getByIdUserService = (id: number) => {
    return prisma.user.findUnique({
        where: { id }
    });
}
