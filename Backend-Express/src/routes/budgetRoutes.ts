import BudgetController from "../controllers/budget.controller";
import { AddBudgetCategoriesDto, BudgetSummaryQueryDto, CreateBudgetDto, UpdateBudgetDto } from "../dto/budget.dto";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import BaseRouter, { RouteConfig } from "./base.router";

class BudgetRouter extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            /**
             * @openapi
             * components:
             *   schemas:
             *     CreateBudgetDto:
             *       type: object
             *       properties:
             *         name:
             *           type: string
             *         amountPlanned:
             *           type: number
             *         startDate:
             *           type: string
             *           format: date-time
             *         endDate:
             *           type: string
             *           format: date-time
             *         groupId:
             *           type: integer
             *       required: [name, amountPlanned, startDate]
             *     UpdateBudgetDto:
             *       type: object
             *       properties:
             *         name:
             *           type: string
             *         amountPlanned:
             *           type: number
             *         startDate:
             *           type: string
             *         endDate:
             *           type: string
             *     AddBudgetCategoriesDto:
             *       type: object
             *       properties:
             *         categoryIds:
             *           type: array
             *           items:
             *             type: integer
             *       required: [categoryIds]
             * /budgets:
             *   post:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Budget
             *     summary: Creer un budget personnel ou de groupe
             *     description: Cree un budget pour l'utilisateur authentifie et renvoie l'objet cree dans la cle budget.
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             $ref: '#/components/schemas/CreateBudgetDto'
             *     responses:
             *       201:
             *         description: Budget cree
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'post',
                path: '/',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(CreateBudgetDto, 'body')],
                handler: BudgetController.create
            },
            /**
             * @openapi
             * /budgets:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Budget
             *     summary: Lister les budgets de l'utilisateur
             *     description: Retourne tous les budgets accessibles par l'utilisateur connecte.
             *     responses:
             *       200:
             *         description: Liste des budgets
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'get',
                path: '/',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: BudgetController.list
            },
            /**
             * @openapi
             * /budgets/{id}:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Budget
             *     summary: Recuperer un budget par son identifiant
             *     description: Verifie l'id puis retourne le budget s'il appartient a l'utilisateur.
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *     responses:
             *       200:
             *         description: Budget trouve
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'get',
                path: "/:id",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: BudgetController.getById
            },
            /**
             * @openapi
             * /budgets/{id}:
             *   put:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Budget
             *     summary: Mettre a jour un budget existant
             *     description: Met a jour les champs transmis du budget cible et renvoie la version mise a jour.
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
             *             $ref: '#/components/schemas/UpdateBudgetDto'
             *     responses:
             *       200:
             *         description: Budget mis a jour
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'put',
                path: '/:id',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(UpdateBudgetDto, 'body')],
                handler: BudgetController.update
            },
            /**
             * @openapi
             * /budgets/{id}:
             *   delete:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Budget
             *     summary: Supprimer un budget
             *     description: Supprime definitivement le budget cible s'il est accessible par l'utilisateur.
             *     parameters:
             *       - in: path
             *         name: id
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
                method: 'delete',
                path: '/:id',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: BudgetController.remove
            },
            /**
             * @openapi
             * /budgets/{id}/categories:
             *   post:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Budget
             *     summary: Associer des categories a un budget
             *     description: Ajoute plusieurs categories au budget via le tableau categoryIds.
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
             *             $ref: '#/components/schemas/AddBudgetCategoriesDto'
             *     responses:
             *       200:
             *         description: Budget mis a jour avec les categories
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'post',
                path: '/:id/categories',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(AddBudgetCategoriesDto, 'body')],
                handler: BudgetController.addCategories
            },
            /**
             * @openapi
             * /budgets/{id}/categories/{categoryId}:
             *   delete:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Budget
             *     summary: Retirer une categorie d'un budget
             *     description: Supprime le lien entre la categorie et le budget puis renvoie le budget mis a jour.
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *       - in: path
             *         name: categoryId
             *         required: true
             *         schema:
             *           type: integer
             *     responses:
             *       200:
             *         description: Budget mis a jour
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'delete',
                path: '/:id/categories/:categoryId',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: BudgetController.removeCategory
            },
            /**
             * @openapi
             * /budgets/{id}/summary:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Budget
             *     summary: Obtenir le resume d'un budget
             *     description: Calcule les indicateurs du budget sur une periode optionnelle (from/to).
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *       - in: query
             *         name: from
             *         schema:
             *           type: string
             *           format: date
             *       - in: query
             *         name: to
             *         schema:
             *           type: string
             *           format: date
             *     responses:
             *       200:
             *         description: Resume du budget
             *       401:
             *         description: Non authentifie
             */
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