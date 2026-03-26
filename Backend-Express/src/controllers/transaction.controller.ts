import { Request, Response } from "express";
import {
    createTransactionService,
    deleteTransactionService,
    getTransactionByIdService,
    listTransactionsService,
    updateTransactionService,
    listTransactionsSchedulesService
} from "../services/transaction.service";
import { CreateTransactionDto, ListTransactionsQueryDto, UpdateTransactionDto } from "../dto/transaction.dto";

class TransactionController {
    static create = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const dto = req.body as CreateTransactionDto;

            const transaction = await createTransactionService(userId, dto);
            return res.status(201).json({ transaction });
        } catch (err: any) {
            const status = err?.statusCode ?? 500;

            console.log(err);
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static list = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const dto = (req as any).validated_query as ListTransactionsQueryDto;
            const result = await listTransactionsService(userId, dto);

            return res.status(200).json(result);
        } catch (err: any) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static listSchedule = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const result = await listTransactionsSchedulesService(userId);

            return res.status(200).json(result);
        } catch (err: any) {
            console.log(err);
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

            const transaction = await getTransactionByIdService(userId, id);
            if (!transaction) return res.status(404).json({ error: "Transaction not found" });

            return res.status(200).json({ transaction });
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

            const dto = req.body as UpdateTransactionDto;
            const transaction = await updateTransactionService(userId, id, dto);

            return res.status(200).json({ transaction });
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

            if (!Number.isInteger(id)) {
                return res.status(400).json({ error: "Invalid id" });
            }

            const existing = await getTransactionByIdService(userId, id);
            if (!existing) return res.status(404).json({ error: "Transaction not found" });

            await deleteTransactionService(id);
            return res.status(204).send();
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
}

export default TransactionController;
