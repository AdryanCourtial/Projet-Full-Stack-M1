import EnvelopeController from "../controllers/envelope.controller";
import { AssignEnvelopeTransactionsDto, CreateEnvelopeDto, EnvelopeSummaryQueryDto, UpdateEnvelopeDto } from "../dto/envelope.dto";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import BaseRouter, { RouteConfig } from "./base.router";

class EnvelopeRouter extends BaseRouter {
    protected routes (): RouteConfig[] {
        return [
            /**
             * @openapi
             * components:
             *   schemas:
             *     CreateEnvelopeDto:
             *       type: object
             *       properties:
             *         name:
             *           type: string
             *         amount:
             *           type: number
             *       required: [name, amount]
             *     UpdateEnvelopeDto:
             *       type: object
             *       properties:
             *         name:
             *           type: string
             *         amount:
             *           type: number
             *     AssignEnvelopeTransactionsDto:
             *       type: object
             *       properties:
             *         transactionIds:
             *           type: array
             *           items:
             *             type: integer
             *       required: [transactionIds]
             * /envelopes:
             *   post:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Envelope
             *     summary: Creer une enveloppe budgetaire
             *     description: Cree une enveloppe pour l'utilisateur connecte et renvoie l'objet cree dans la cle envelope.
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             $ref: '#/components/schemas/CreateEnvelopeDto'
             *     responses:
             *       201:
             *         description: Enveloppe creee
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'post',
                path: '/',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(CreateEnvelopeDto, 'body')],
                handler: EnvelopeController.create
            },
            /**
             * @openapi
             * /envelopes:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Envelope
             *     summary: Lister les enveloppes de l'utilisateur
             *     description: Retourne toutes les enveloppes accessibles par l'utilisateur.
             *     responses:
             *       200:
             *         description: Liste des enveloppes
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'get',
                path: '/',
                middlewares: [AuthMiddleware.authenticateUser],
                handler: EnvelopeController.list
            },
            /**
             * @openapi
             * /envelopes/{id}:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Envelope
             *     summary: Recuperer une enveloppe par son identifiant
             *     description: Verifie l'id puis retourne l'enveloppe si elle existe pour l'utilisateur.
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *     responses:
             *       200:
             *         description: Enveloppe trouvee
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'get',
                path: "/:id",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: EnvelopeController.getById
            },
            /**
             * @openapi
             * /envelopes/{id}:
             *   put:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Envelope
             *     summary: Mettre a jour une enveloppe
             *     description: Met a jour les champs transmis de l'enveloppe cible et renvoie la version mise a jour.
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
             *             $ref: '#/components/schemas/UpdateEnvelopeDto'
             *     responses:
             *       200:
             *         description: Enveloppe mise a jour
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'put',
                path: '/:id',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(UpdateEnvelopeDto, 'body')],
                handler: EnvelopeController.update
            },
            /**
             * @openapi
             * /envelopes/{id}:
             *   delete:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Envelope
             *     summary: Supprimer une enveloppe
             *     description: Supprime l'enveloppe cible si elle appartient a l'utilisateur.
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
                handler: EnvelopeController.remove
            },
            /**
             * @openapi
             * /envelopes/{id}/transactions:
             *   patch:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Envelope
             *     summary: Assigner des transactions a une enveloppe
             *     description: Associe la liste transactionIds a l'enveloppe cible puis renvoie l'enveloppe mise a jour.
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
             *             $ref: '#/components/schemas/AssignEnvelopeTransactionsDto'
             *     responses:
             *       200:
             *         description: Enveloppe mise a jour
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'patch',
                path: '/:id/transactions',
                middlewares: [AuthMiddleware.authenticateUser, validationMiddleware(AssignEnvelopeTransactionsDto, 'body')],
                handler: EnvelopeController.assignTransactions
            },
            /**
             * @openapi
             * /envelopes/{id}/summary:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Envelope
             *     summary: Obtenir le resume d'une enveloppe
             *     description: Calcule les indicateurs de l'enveloppe sur une periode optionnelle (from/to).
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
             *         description: Resume de l'enveloppe
             *       401:
             *         description: Non authentifie
             */
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