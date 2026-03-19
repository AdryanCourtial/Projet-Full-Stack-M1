import GroupController from "../controllers/group.controller";
import { AddGroupMemberDto, CreateGroupDto } from "../dto/group.dto";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import BaseRouter, { RouteConfig } from "./base.router";

class GroupRoutes extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            /**
             * @openapi
             * components:
             *   schemas:
             *     CreateGroupDto:
             *       type: object
             *       properties:
             *         name:
             *           type: string
             *       required: [name]
             *     AddGroupMemberDto:
             *       type: object
             *       properties:
             *         userId:
             *           type: integer
             *       required: [userId]
             *     Group:
             *       type: object
             *       properties:
             *         id:
             *           type: integer
             *         name:
             *           type: string
             * /groups:
             *   post:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Group
             *     summary: Creer un groupe
             *     description: Cree un groupe dont l'utilisateur courant devient proprietaire.
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             $ref: '#/components/schemas/CreateGroupDto'
             *     responses:
             *       201:
             *         description: Groupe cree
             *       401:
             *         description: Non authentifie
             */
            {
                method: "post",
                path: "/",
                middlewares: [
                    AuthMiddleware.authenticateUser,
                    validationMiddleware(CreateGroupDto, "body"),
                ],
                handler: GroupController.create,
            },
            /**
             * @openapi
             * /groups:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Group
             *     summary: Lister les groupes de l'utilisateur
             *     description: Retourne les groupes dont l'utilisateur est membre.
             *     responses:
             *       200:
             *         description: Liste des groupes
             *       401:
             *         description: Non authentifie
             */
            {
                method: "get",
                path: "/",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: GroupController.list,
            },
            /**
             * @openapi
             * /groups/{id}:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Group
             *     summary: Recuperer un groupe par son identifiant
             *     description: Retourne le groupe cible avec ses membres si l'utilisateur y a acces.
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *     responses:
             *       200:
             *         description: Groupe trouve
             *       401:
             *         description: Non authentifie
             */
            {
                method: "get",
                path: "/:id",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: GroupController.getById,
            },
            /**
             * @openapi
             * /groups/{id}/members:
             *   post:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Group
             *     summary: Ajouter un membre a un groupe
             *     description: Ajoute l'utilisateur userId comme membre du groupe (action reservee au proprietaire).
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             $ref: '#/components/schemas/AddGroupMemberDto'
             *     responses:
             *       204:
             *         description: Membre ajoute
             *       401:
             *         description: Non authentifie
             */
            {
                method: "post",
                path: "/:id/members",
                middlewares: [
                    AuthMiddleware.authenticateUser,
                    validationMiddleware(AddGroupMemberDto, "body"),
                ],
                handler: GroupController.addMember,
            },
            /**
             * @openapi
             * /groups/{id}/members/{userId}:
             *   delete:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Group
             *     summary: Retirer un membre du groupe
             *     description: Supprime un membre du groupe (action reservee au proprietaire).
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *       - in: path
             *         name: userId
             *         required: true
             *         schema:
             *           type: integer
             *     responses:
             *       204:
             *         description: Supprime
             *       401:
             *         description: Non authentifie
             */
            {
                method: "delete",
                path: "/:id/members/:userId",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: GroupController.removeMember,
            },

        ];
    }
}

export default new GroupRoutes().router;