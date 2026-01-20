import TransactionController from "../controllers/transaction.controller";
import { CreateTransactionDto, ListTransactionsQueryDto, UpdateTransactionDto } from "../dto/transaction.dto";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import BaseRouter, { RouteConfig } from "./base.router";

class TransactionRouter extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            {
                method: 'get',
                path: '/',
                middlewares: [
                    AuthMiddleware.authenticateUser, validationMiddleware(ListTransactionsQueryDto, 'query')
                ],
                handler: TransactionController.list
            },
            {
                method: 'post',
                path: '/',
                middlewares: [
                    AuthMiddleware.authenticateUser, validationMiddleware(CreateTransactionDto, 'body')
                ],
                handler: TransactionController.create
            },
            {
                method: 'get',
                path: '/:id',
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: TransactionController.getById
            },
            {
                method: 'put',
                path: '/:id',
                middlewares: [
                    AuthMiddleware.authenticateUser, validationMiddleware(UpdateTransactionDto, 'body')
                ],
                handler: TransactionController.update
            },
            {
                method: 'delete',
                path: '/:id',
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: TransactionController.remove
            }
        ]
    }
}
    
export default new TransactionRouter().router;