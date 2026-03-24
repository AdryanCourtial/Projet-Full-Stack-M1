import prisma from "../client";
import { Prisma } from "@prisma/client";

const categories: Prisma.CategoryCreateManyArgs = {
  data: [
    {
      id: 1,
      name: "Logement",
    },
    {
      id: 2,
      name: "Abbonement",
    },
    {
      id: 3,
      name: "Transport",
    },
    {
      id: 4,
      name: "Santé & assurances",
    },
    {
      id: 5,
      name: "Crédits & dettes",
    },
    {
      id: 6,
      name: "Impôts & taxes",
    },
    {
      id: 7,
      name: "Famille",
    },
    {
      id: 8,
      name: "Épargne programmée",
    },
  ],
  skipDuplicates: true,
};

export const seedCategories = async () => {
  await prisma.category.createMany(categories);
};
