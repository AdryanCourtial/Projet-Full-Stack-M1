import { Router } from "express";
import BaseRouter, { RouteConfig } from "./base.router";
import AuthMiddleware from "../middlewares/auth.middleware";
import UserController from "../controllers/user.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { UserDto } from "../dto/user.dto";

class UserRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      /**
       * @openapi
       * components:
       *   securitySchemes:
       *     bearerAuth:
       *       type: http
       *       scheme: bearer
       *       bearerFormat: JWT
       *   schemas:
       *     User:
       *       type: object
       *       properties:
       *         id:
       *           type: number
       *         username:
       *           type: string
       *         email:
       *           type: string
       * /user/info:
       *   get:
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - User
       *     summary: Recuperer le profil de l'utilisateur connecte
       *     description: Lit l'utilisateur depuis le userId du token et renvoie l'objet dans la cle user.
       *     responses:
       *       200:
       *         description: Informations utilisateur recuperees
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 user:
       *                   $ref: '#/components/schemas/User'
       *       401:
       *         description: Non authentifie
       */
      {
        method: "get",
        path: "/info",
        middlewares: [AuthMiddleware.authenticateUser],
        handler: UserController.getUser,
      },
      /**
       * @openapi
       * /user/all:
       *   get:
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - User
       *     summary: Lister les utilisateurs
       *     description: Renvoie tous les utilisateurs dans la cle users.
       *     responses:
       *       200:
       *         description: Liste de tous les utilisateurs
       *       401:
       *         description: Non authentifie
       */
      {
        method: "get",
        path: "/all",
        middlewares: [
          AuthMiddleware.authenticateUser,
          validationMiddleware(UserDto, "query"),
        ],
        handler: UserController.getAllUsers,
      },
    ];
  }
}

export default new UserRouter().router;
