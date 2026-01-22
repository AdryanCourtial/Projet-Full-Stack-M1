import EnvelopeController from "../controllers/envelope.controller";
import { AssignEnvelopeTransactionsDto, CreateEnvelopeDto, EnvelopeSummaryQueryDto, UpdateEnvelopeDto } from "../dto/envelope.dto";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import BaseRouter, { RouteConfig } from "./base.router";

class EnvelopeRouter extends BaseRouter {
    protected routes (): RouteConfig[] {
        return [
            {
                method: 'post',
                path: '/',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(CreateEnvelopeDto, 'body')],
                handler: EnvelopeController.create
            },
            {
                method: 'get',
                path: '/',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: EnvelopeController.list
            },
            {
                method: 'get',
                path: "/:id",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: EnvelopeController.getById
            },
            {
                method: 'put',
                path: '/:id',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(UpdateEnvelopeDto, 'body')],
                handler: EnvelopeController.update
            },
            {
                method: 'delete',
                path: '/:id',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: EnvelopeController.remove
            },
            {
                method: 'patch',
                path: '/:id/transactions',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(AssignEnvelopeTransactionsDto, 'body')],
                handler: EnvelopeController.assignTransactions
            },
            {
                method: 'get',
                path: '/:id/summary',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(EnvelopeSummaryQueryDto, 'query')],
                handler: EnvelopeController.summary
            }
        ]
    }
}

export default new EnvelopeRouter().router;