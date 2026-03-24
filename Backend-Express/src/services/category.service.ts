import prisma from "../prisma/client";

export type CreateCategoryInput = {
  name: string;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export const createCategoryService = (
  userId: number,
  data: CreateCategoryInput,
) => {
  return prisma.category.create({
    data: {
      userId,
      name: data.name.trim(),
    },
  });
};

export const getAllCategoriesService = (userId?: number) => {
  return prisma.category.findMany({
    where: {
      userId,
    },
    orderBy: { name: "asc" },
  });
};

export const getCategoryByIdService = (userId: number, id: number) => {
  return prisma.category.findFirst({
    where: { id, userId },
  });
};

export const updateCategoryService = (
  userId: number,
  id: number,
  data: UpdateCategoryInput,
) => {
  return prisma.category.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
    },
  });
};

export const deleteCategoryService = (userId: number, id: number) => {
  return prisma.category.delete({
    where: { id },
  });
};
