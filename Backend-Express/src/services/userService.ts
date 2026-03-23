import prisma from "../prisma/client";

// Service to get all users from the database
export const getAllUsersService = (q?: string) => {
  const search = q?.trim();

  return prisma.user.findMany({
    where: search
      ? {
          OR: [
            { username: { contains: search } },
            { email: { contains: search } },
            { firstName: { contains: search } },
            { lastName: { contains: search } },
          ],
        }
      : undefined,
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
    },
    take: 20,
    orderBy: { id: "desc" },
  });
};

// Service to get a user by ID from the database
export const getByIdUserService = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};
