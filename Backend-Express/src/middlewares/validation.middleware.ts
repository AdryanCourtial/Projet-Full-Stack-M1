import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import Send from "../utils/response.utils";

export const validationMiddleware = (type: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObj = plainToInstance(type, req.body);
        const errors = await validate(dtoObj);

        if (errors.length > 0) {
        const messages = errors
            .map(err => Object.values(err.constraints || {}))
            .flat();
        return Send.error(res, null, messages.join(", "), 400);
        }

        req.body = dtoObj;
        next();
    };
};
