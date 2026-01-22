import ScheduleController from "../controllers/schedule.controller";
import { CreateScheduleDto, RunScheduleQueryDto, UpdateScheduleDto } from "../dto/schedule.dto";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import BaseRouter, { RouteConfig } from "./base.router";

class ScheduleRouter extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            {
                method: 'post',
                path: '/',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(CreateScheduleDto, 'body')],
                handler: ScheduleController.create
            },
            {
                method: 'post',
                path: '/:id/run',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(RunScheduleQueryDto, 'query')],
                handler: ScheduleController.run
            },
            {
                method: 'get',
                path: '/',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: ScheduleController.list
            },
            {
                method: 'get',
                path: "/:id",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: ScheduleController.getById
            },
            {
                method: 'put',
                path: '/:id',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(UpdateScheduleDto, 'body')],
                handler: ScheduleController.update
            },
            {
                method: 'delete',
                path: '/:id',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: ScheduleController.remove
            }
        ]
    }
}

export default new ScheduleRouter().router;
