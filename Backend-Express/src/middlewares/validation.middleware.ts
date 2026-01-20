import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import Send from "../utils/response.utils";

type Source = "body" | "query" | "params";

export const validationMiddleware = (type: any, source: Source = "body") => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = (req as any)[source] ?? {};
            console.log("Validating", source, data);
            const dtoObj = plainToInstance(type, data, {
                enableImplicitConversion: true,
            });

            const errors = await validate(dtoObj, {
                whitelist: true,
                forbidNonWhitelisted: true,
            });

            if (errors.length > 0) {
                const messages = errors.flatMap(e => Object.values(e.constraints ?? {}));
                return Send.error(res, null, messages.join(", "), 400);
            }

            (req as any)[`validated_${source}`] = dtoObj;

            if (source === "body") req.body = dtoObj;
            return next();
        } catch (e: any) {
            return Send.error(res, null, e?.message ?? "Validation error", 500);
        }
    };
};
