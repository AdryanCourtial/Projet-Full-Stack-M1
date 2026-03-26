import prisma from "../prisma/client";
import { TransactionType } from "@prisma/client";

export type CreateCategoryInput = {
    name: string;
    type: TransactionType;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export const createCategoryService = (userId: number, data: CreateCategoryInput) => {
    return prisma.category.create({
        data: {
            userId,
            name: data.name.trim(),
            type: data.type,
        },
    });
};

export const getAllCategoriesService = (userId?: number, type?: TransactionType) => {
    return prisma.category.findMany({
        where: {
            OR: [
                {
                    userId,
                },
                {
                    userId: null
                }
            ],
            ...(type ? { type } : {}),
        },
        orderBy: { name: "asc" },
    });
};

export const getCategoryByIdService = (userId: number, id: number) => {
    return prisma.category.findFirst({
        where: { id, userId },
    });
};

export const updateCategoryService = (userId: number, id: number, data: UpdateCategoryInput) => {
    return prisma.category.update({
        where: { id },
        data: {
            ...(data.name !== undefined ? { name: data.name.trim() } : {}),
            ...(data.type !== undefined ? { type: data.type } : {}),
        },
    });
};

export const deleteCategoryService = (userId: number, id: number) => {
    return prisma.category.delete({
        where: { id },
    });
};
