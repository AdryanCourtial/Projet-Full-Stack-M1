// src/controllers/envelope.controller.ts
import { Request, Response } from "express";
import {
    assignEnvelopeToTransactionsService,
    createEnvelopeService,
    deleteEnvelopeService,
    getEnvelopeByIdService,
    getEnvelopeSummaryService,
    listEnvelopesService,
    updateEnvelopeService,
} from "../services/envelope.service";
import {
    AssignEnvelopeTransactionsDto,
    CreateEnvelopeDto,
    EnvelopeSummaryQueryDto,
    UpdateEnvelopeDto,
} from "../dto/envelope.dto";

class EnvelopeController {
    static create = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const dto = (req as any).validated_body as CreateEnvelopeDto;

            const envelope = await createEnvelopeService(userId, dto);
            return res.status(201).json({ envelope });
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static list = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const envelopes = await listEnvelopesService(userId);
            return res.status(200).json({ envelopes });
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static getById = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

            const envelope = await getEnvelopeByIdService(userId, id);
            if (!envelope) return res.status(404).json({ error: "Envelope not found" });

            return res.status(200).json({ envelope });
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static update = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

            const dto = (req as any).validated_body as UpdateEnvelopeDto;
            const envelope = await updateEnvelopeService(userId, id, dto);

            return res.status(200).json({ envelope });
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

            await deleteEnvelopeService(userId, id);
            return res.status(204).send();
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static assignTransactions = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const envelopeId = Number(req.params.id);
            if (!Number.isInteger(envelopeId)) return res.status(400).json({ error: "Invalid id" });

            const dto = (req as any).validated_body as AssignEnvelopeTransactionsDto;
            const envelope = await assignEnvelopeToTransactionsService(userId, envelopeId, dto);

            return res.status(200).json({ envelope });
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static summary = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const envelopeId = Number(req.params.id);
            if (!Number.isInteger(envelopeId)) return res.status(400).json({ error: "Invalid id" });

            const q = (req as any).validated_query as EnvelopeSummaryQueryDto;
            const data = await getEnvelopeSummaryService(userId, envelopeId, q);

            return res.status(200).json(data);
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
}

export default EnvelopeController;
