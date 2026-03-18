import prisma from "../client"
import { Prisma, TransactionType } from "@prisma/client"

const categories: Prisma.CategoryCreateManyArgs = {
    data: [
        {
            id: 1,
            name: "Logement",
            type: TransactionType.EXPENSE
        },
        {
            id: 2,
            name: "Abbonement",
            type: TransactionType.EXPENSE
        },
        {
            id: 3,
            name: "Transport",
            type: TransactionType.EXPENSE
        },
        {
            id: 4,
            name: "Santé & assurances",
            type: TransactionType.EXPENSE
        },
        {
            id: 5,
            name: "Crédits & dettes",
            type: TransactionType.EXPENSE
        }, 
        {
            id: 6,
            name: "Impôts & taxes",
            type: TransactionType.EXPENSE
        },
        {
            id: 7,
            name: "Famille",
            type: TransactionType.EXPENSE
        },
        {
            id: 8,
            name: "Épargne programmée",
            type: TransactionType.EXPENSE
        },   
    
    ],
    skipDuplicates: true
}

export const seedCategories = async () => {
    await prisma.category.createMany(categories)
}