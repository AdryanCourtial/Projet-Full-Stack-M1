import ScheduleController from "../controllers/schedule.controller";
import { CreateScheduleDto, RunScheduleQueryDto, UpdateScheduleDto } from "../dto/schedule.dto";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import BaseRouter, { RouteConfig } from "./base.router";

class ScheduleRouter extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            /**
             * @openapi
             * components:
             *   schemas:
             *     CreateScheduleDto:
             *       type: object
             *       properties:
             *         name:
             *           type: string
             *         amount:
             *           type: number
             *         type:
             *           type: string
             *           enum: [INCOME, EXPENSE]
             *         categoryId:
             *           type: integer
             *         budgetId:
             *           type: integer
             *         frequency:
             *           type: string
             *         customInterval:
             *           type: integer
             *         startDate:
             *           type: string
             *           format: date-time
             *         endDate:
             *           type: string
             *           format: date-time
             *         isActive:
             *           type: boolean
             *       required: [name, amount, type, categoryId, startDate]
             *     UpdateScheduleDto:
             *       type: object
             *       properties:
             *         name:
             *           type: string
             *         amount:
             *           type: number
             *         type:
             *           type: string
             *         categoryId:
             *           type: integer
             *         frequency:
             *           type: string
             *         startDate:
             *           type: string
             * /schedules:
             *   post:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Schedule
             *     summary: Creer une planification recurrente
             *     description: Cree une planification de transaction pour l'utilisateur et renvoie l'objet schedule cree.
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             $ref: '#/components/schemas/CreateScheduleDto'
             *     responses:
             *       201:
             *         description: Planification creee
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'post',
                path: '/',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(CreateScheduleDto, 'body')],
                handler: ScheduleController.create
            },
            /**
             * @openapi
             * /schedules/{id}/run:
             *   post:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Schedule
             *     summary: Executer une planification a la demande
             *     description: Force l'execution immediate de la planification et renvoie le resultat d'execution.
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *       - in: query
             *         name: dryRun
             *         schema:
             *           type: boolean
             *         description: Si true, simule sans ecriture
             *     responses:
             *       200:
             *         description: Planification executee
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'post',
                path: '/:id/run',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(RunScheduleQueryDto, 'query')],
                handler: ScheduleController.run
            },
            /**
             * @openapi
             * /schedules:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Schedule
             *     summary: Lister les planifications de l'utilisateur
             *     description: Retourne toutes les planifications accessibles par l'utilisateur.
             *     responses:
             *       200:
             *         description: Liste des planifications
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'get',
                path: '/',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: ScheduleController.list
            },
            /**
             * @openapi
             * /schedules/{id}:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Schedule
             *     summary: Recuperer une planification par son identifiant
             *     description: Verifie l'id puis retourne la planification cible si elle appartient a l'utilisateur.
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *     responses:
             *       200:
             *         description: Planification trouvee
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'get',
                path: "/:id",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: ScheduleController.getById
            },
            /**
             * @openapi
             * /schedules/{id}:
             *   put:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Schedule
             *     summary: Mettre a jour une planification
             *     description: Met a jour les champs transmis puis renvoie la planification mise a jour.
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
             *             $ref: '#/components/schemas/UpdateScheduleDto'
             *     responses:
             *       200:
             *         description: Planification mise a jour
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'put',
                path: '/:id',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(UpdateScheduleDto, 'body')],
                handler: ScheduleController.update
            },
            /**
             * @openapi
             * /schedules/{id}:
             *   delete:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Schedule
             *     summary: Supprimer une planification
             *     description: Supprime la planification cible si elle appartient a l'utilisateur.
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *     responses:
             *       204:
             *         description: Supprimee
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'delete',
                path: '/:id',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: ScheduleController.remove
            }
        ]
    }
}

export default new ScheduleRouter().router;
