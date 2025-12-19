import { Router } from "express";
import BaseRouter, { RouteConfig } from "./base.router";
import AuthMiddleware from "../middlewares/auth.middleware";
import UserController from "../controllers/user.controller";

class UserRouter extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            /**
             * @openapi
             * /user/info:
             *   get:
             *     tags:
             *       - User
             *     summary: Get user info
             *     description: Returns the authenticated user's information.
             *     responses:
             *       200:
             *         description: User info retrieved successfully
             *         content:
             *           application/json:
             *             schema:
             *               type: object
             *               properties:
             *                 id:
             *                   type: number
             *                 username:
             *                   type: string
             *                 email:
             *                   type: string
             *       401:
             *         description: Unauthorized
             */
            {
                method: "get",
                path: "/info",
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: UserController.getUser
            },
            {
                method: "get",
                path: "/all",
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: UserController.getAllUsers
            }
        ];
    }
}


export default new UserRouter().router;