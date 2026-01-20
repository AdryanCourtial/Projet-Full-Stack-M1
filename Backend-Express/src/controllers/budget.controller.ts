// src/controllers/budget.controller.ts
import { Request, Response } from "express";
import {
    addBudgetCategoriesService,
    createBudgetService,
    deleteBudgetService,
    getBudgetByIdService,
    getBudgetSummaryService,
    listBudgetsService,
    removeBudgetCategoryService,
    updateBudgetService,
} from "../services/budget.service";
import {
    AddBudgetCategoriesDto,
    BudgetSummaryQueryDto,
    CreateBudgetDto,
    UpdateBudgetDto,
} from "../dto/budget.dto";

class BudgetController {
    static create = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const dto = (req as any).validated_body as CreateBudgetDto;

            const budget = await createBudgetService(userId, dto);
            return res.status(201).json({ budget });
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static list = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const budgets = await listBudgetsService(userId);
            return res.status(200).json({ budgets });
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static getById = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

            const budget = await getBudgetByIdService(userId, id);
            if (!budget) return res.status(404).json({ error: "Budget not found" });

            return res.status(200).json({ budget });
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static update = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

            const dto = (req as any).validated_body as UpdateBudgetDto;
            const budget = await updateBudgetService(userId, id, dto);
            return res.status(200).json({ budget });
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static remove = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

            await deleteBudgetService(userId, id);
            return res.status(204).send();
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static addCategories = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const budgetId = Number(req.params.id);
            if (!Number.isInteger(budgetId)) return res.status(400).json({ error: "Invalid id" });

            const dto = (req as any).validated_body as AddBudgetCategoriesDto;

            const budget = await addBudgetCategoriesService(userId, budgetId, dto);
            return res.status(200).json({ budget });
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static removeCategory = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const budgetId = Number(req.params.id);
            const categoryId = Number(req.params.categoryId);

            if (!Number.isInteger(budgetId) || !Number.isInteger(categoryId)) {
                return res.status(400).json({ error: "Invalid id" });
            }

            const budget = await removeBudgetCategoryService(userId, budgetId, categoryId);
            return res.status(200).json({ budget });
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static summary = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const budgetId = Number(req.params.id);
            if (!Number.isInteger(budgetId)) return res.status(400).json({ error: "Invalid id" });

            const q = (req as any).validated_query as BudgetSummaryQueryDto;
            const data = await getBudgetSummaryService(userId, budgetId, q);

            return res.status(200).json(data);
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
}

export default BudgetController;
