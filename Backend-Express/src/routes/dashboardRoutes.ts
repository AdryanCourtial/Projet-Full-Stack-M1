import DashboardController from "../controllers/dashboard.controller";
import { DashboardMonthlyQueryDto } from "../dto/dashboard.dto";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import BaseRouter, { RouteConfig } from "./base.router";

class DashboardRouter extends BaseRouter {
        protected routes(): RouteConfig[] {
            return [
                {
                    method: 'get',
                    path: '/monthly',
                    middlewares: [ AuthMiddleware.authenticateUser, validationMiddleware(DashboardMonthlyQueryDto, 'query') ],
                    handler: DashboardController.monthly
                }
            ]
        }
}

export default new DashboardRouter().router;