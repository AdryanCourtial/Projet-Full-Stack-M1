import AuthController from "../controllers/auth.controller";
import BaseRouter, { RouteConfig } from "./base.router";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { LoginDto } from "../dto/auth/login.dto";
import { RegisterDto } from "../dto/auth/register.dto";
import AuthMiddleware from "../middlewares/auth.middleware";

class AuthRouter extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            {
                method: "post",
                path: "/login",
                middlewares: [validationMiddleware(LoginDto)],
                handler: AuthController.login
            },
            {
                method: "post",
                path: "/register",
                middlewares: [validationMiddleware(RegisterDto)],
                handler: AuthController.register
            },
            {
                method: "post",
                path: "/logout",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: AuthController.logout
            },
            {
                method: "post",
                path: "/refresh-token",
                middlewares: [AuthMiddleware.refreshTokenValidation],
                handler: AuthController.refreshToken
            }
        ];
    }
}

export default new AuthRouter().router;
