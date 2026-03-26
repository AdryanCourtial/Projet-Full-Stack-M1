import { Request, Response } from "express";
import { Prisma, TransactionType } from "@prisma/client";
import { createCategoryService, deleteCategoryService, getAllCategoriesService, getCategoryByIdService, updateCategoryService } from "../services/category.service";

const isValidTransactionType = (value: any): value is TransactionType =>
    value === "INCOME" || value === "EXPENSE";

class CategoryController {
    static create = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;

            const { name, type } = req.body;

            if (!name || typeof name !== "string" || !name.trim()) {
                return res.status(400).json({ error: "name is required" });
            }
            if (!isValidTransactionType(type)) {
                return res.status(400).json({ error: "type must be INCOME or EXPENSE" });
            }

            const category = await createCategoryService(userId, { name, type });
            return res.status(201).json({ category });
        } catch (err: any) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                return res.status(409).json({ error: "Category already exists" });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static list = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number ?? undefined;

            const { type } = req.query;
            let parsedType: TransactionType | undefined = undefined;

            if (type !== undefined) {
                if (!isValidTransactionType(type)) {
                    return res.status(400).json({ error: "type must be INCOME or EXPENSE" });
                }
                parsedType = type;
            }

            const categories = await getAllCategoriesService(userId, parsedType);
            return res.status(200).json(categories);
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static getById = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.status(400).json({ error: "Invalid id" });
            }

            const category = await getCategoryByIdService(userId, id);
            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }
            return res.status(200).json({ category });
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static update = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.status(400).json({ error: "Invalid id" });
            }

            const existing = await getCategoryByIdService(userId, id);
            if (!existing) {
                return res.status(404).json({ error: "Category not found" });
            }

            const { name, type } = req.body;

            if (name !== undefined && (typeof name !== "string" || !name.trim())) {
                return res.status(400).json({ error: "name must be a non-empty string" });
            }
            if (type !== undefined && !isValidTransactionType(type)) {
                return res.status(400).json({ error: "type must be INCOME or EXPENSE" });
            }

            const category = await updateCategoryService(userId, id, { name, type });
            return res.status(200).json({ category });
        } catch (err: any) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                return res.status(409).json({ error: "Category already exists" });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static remove = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.status(400).json({ error: "Invalid id" });
            }

            const existing = await getCategoryByIdService(userId, id);
            if (!existing) {
                return res.status(404).json({ error: "Category not found" });
            }

            await deleteCategoryService(userId, id);
            return res.status(204).send();
        } catch (err: any) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
}

export default CategoryController;
