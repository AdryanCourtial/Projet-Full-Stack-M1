import bcrypt from "bcrypt";
import prisma from "../prisma/client";

export const validateUserCredentials = async (
    email: string,
    password: string
) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
};

export const registerUser = async (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
) => {
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword
        }
    });
};

export const saveRefreshToken = async (
    userId: number,
    refreshToken: string | null
) => {
    return prisma.user.update({
        where: { id: userId },
        data: { refreshToken }
    });
};

export const getUserById = async (userId: number) => {
    return prisma.user.findUnique({
        where: { id: userId }
    });
}
