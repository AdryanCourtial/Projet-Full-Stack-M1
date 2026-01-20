import BudgetController from "../controllers/budget.controller";
import { AddBudgetCategoriesDto, BudgetSummaryQueryDto, CreateBudgetDto, UpdateBudgetDto } from "../dto/budget.dto";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import BaseRouter, { RouteConfig } from "./base.router";

class BudgetRouter extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            {
                method: 'post',
                path: '/',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(CreateBudgetDto, 'body')],
                handler: BudgetController.create
            },
            {
                method: 'get',
                path: '/',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: BudgetController.list
            },
            {
                method: 'get',
                path: "/:id",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: BudgetController.getById
            },
            {
                method: 'put',
                path: '/:id',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(UpdateBudgetDto, 'body')],
                handler: BudgetController.update
            },
            {
                method: 'delete',
                path: '/:id',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: BudgetController.remove
            },
            {
                method: 'post',
                path: '/:id/categories',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(AddBudgetCategoriesDto, 'body')],
                handler: BudgetController.addCategories
            },
            {
                method: 'delete',
                path: '/:id/categories/:categoryId',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: BudgetController.removeCategory
            },
            {
                method: 'get',
                path: '/:id/summary',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(BudgetSummaryQueryDto, 'query')],
                handler: BudgetController.summary
            }
        ]
    }
}

export default new BudgetRouter().router;