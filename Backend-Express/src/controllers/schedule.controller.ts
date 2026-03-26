import { Request, Response } from "express";
import {
    createScheduleService,
    deleteScheduleService,
    getScheduleByIdService,
    listSchedulesService,
    runScheduleService,
    runSchedulesForCurrentMonthService,
    updateScheduleService,
} from "../services/schedule.service";
import { CreateScheduleDto, RunScheduleQueryDto, UpdateScheduleDto } from "../dto/schedule.dto";
import { runMonthlySchedules } from "../jobs/schedule.cron";

class ScheduleController {
    static create = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const dto = (req as any).validated_body as CreateScheduleDto;

            const schedule = await createScheduleService(userId, dto);
            await runMonthlySchedules()
            return res.status(201).json({ schedule });
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static list = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const schedules = await listSchedulesService(userId);
            return res.status(200).json(schedules);
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static getById = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

            const schedule = await getScheduleByIdService(userId, id);
            if (!schedule) return res.status(404).json({ error: "Schedule not found" });

            return res.status(200).json({ schedule });
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static update = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

            const dto = (req as any).validated_body as UpdateScheduleDto;
            const schedule = await updateScheduleService(userId, id, dto);

            return res.status(200).json({ schedule });
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

            await deleteScheduleService(userId, id);
            return res.status(204).send();
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static run = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

            const q = (req as any).validated_query as RunScheduleQueryDto;
            const result = await runScheduleService(userId, id, q);
            await runSchedulesForCurrentMonthService()

            return res.status(200).json(result);
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            if (status !== 500) return res.status(status).json({ error: err.message });
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };
}

export default ScheduleController;
