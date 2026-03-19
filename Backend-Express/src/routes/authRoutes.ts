import AuthController from "../controllers/auth.controller";
import BaseRouter, { RouteConfig } from "./base.router";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { LoginDto } from "../dto/auth/login.dto";
import { RegisterDto } from "../dto/auth/register.dto";
import AuthMiddleware from "../middlewares/auth.middleware";

class AuthRouter extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            /**
             * @openapi
             * components:
             *   schemas:
             *     LoginDto:
             *       type: object
             *       properties:
             *         email:
             *           type: string
             *         password:
             *           type: string
             *       required: [email, password]
             *     RegisterDto:
             *       type: object
             *       properties:
             *         username:
             *           type: string
             *         firstName:
             *           type: string
             *         lastName:
             *           type: string
             *         email:
             *           type: string
             *         password:
             *           type: string
             *         password_confirmation:
             *           type: string
             *       required: [username, firstName, lastName, email, password, password_confirmation]
             * /auth/login:
             *   post:
             *     tags:
             *       - Auth
             *     summary: Authentifier un utilisateur
             *     description: Verifie les identifiants, enregistre le refresh token en base et renvoie les cookies httpOnly accessToken et refreshToken.
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             $ref: '#/components/schemas/LoginDto'
             *     responses:
             *       200:
             *         description: Connexion reussie
             *       400:
             *         description: Donnees invalides
             *       401:
             *         description: Identifiants invalides
             */
            {
                method: "post",
                path: "/login",
                middlewares: [validationMiddleware(LoginDto)],
                handler: AuthController.login
            },
            /**
             * @openapi
             * /auth/register:
             *   post:
             *     tags:
             *       - Auth
             *     summary: Creer un nouveau compte utilisateur
             *     description: Cree l'utilisateur puis renvoie ses informations publiques (id, username, email).
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             $ref: '#/components/schemas/RegisterDto'
             *     responses:
             *       201:
             *         description: Compte cree
             *       400:
             *         description: Donnees invalides
             *       409:
             *         description: Email deja utilise
             */
            {
                method: "post",
                path: "/register",
                middlewares: [validationMiddleware(RegisterDto)],
                handler: AuthController.register
            },
            /**
             * @openapi
             * /auth/logout:
             *   post:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Auth
             *     summary: Deconnecter l'utilisateur courant
             *     description: Supprime le refresh token stocke pour l'utilisateur et efface les cookies d'authentification.
             *     responses:
             *       200:
             *         description: Deconnexion reussie
             *       401:
             *         description: Non authentifie
             */
            {
                method: "post",
                path: "/logout",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: AuthController.logout
            },
            /**
             * @openapi
             * /auth/refresh-token:
             *   post:
             *     tags:
             *       - Auth
             *     summary: Regenerer un access token
             *     description: Verifie le refresh token (cookie + base) et remplace le cookie accessToken par un nouveau token valide.
             *     responses:
             *       200:
             *         description: Token rafraichi
             *       401:
             *         description: Token invalide
             */
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
