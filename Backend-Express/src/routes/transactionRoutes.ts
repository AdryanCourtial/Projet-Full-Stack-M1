import TransactionController from "../controllers/transaction.controller";
import { CreateTransactionDto, ListTransactionsQueryDto, UpdateTransactionDto } from "../dto/transaction.dto";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import BaseRouter, { RouteConfig } from "./base.router";

class TransactionRouter extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            /**
             * @openapi
             * components:
             *   schemas:
             *     CreateTransactionDto:
             *       type: object
             *       properties:
             *         amount:
             *           type: number
             *         type:
             *           type: string
             *           enum: [INCOME, EXPENSE]
             *         date:
             *           type: string
             *           format: date-time
             *         description:
             *           type: string
             *         categoryId:
             *           type: integer
             *         budgetId:
             *           type: integer
             *         envelopeId:
             *           type: integer
             *         scheduleId:
             *           type: integer
             *         paymentStatus:
             *           type: boolean
             *       required: [amount, type, date, categoryId]
             *     UpdateTransactionDto:
             *       type: object
             *       properties:
             *         amount:
             *           type: number
             *         type:
             *           type: string
             *         date:
             *           type: string
             *         description:
             *           type: string
             *         categoryId:
             *           type: integer
             * /transactions:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Transaction
             *     summary: Lister les transactions avec filtres optionnels
             *     description: Retourne les transactions paginées avec filtres par date (from/to), type, categories, budgets, enveloppes, groupes et planifications.
             *     parameters:
             *       - in: query
             *         name: from
             *         schema:
             *           type: string
             *           format: date-time
             *         description: Date de debut (format ISO)
             *       - in: query
             *         name: to
             *         schema:
             *           type: string
             *           format: date-time
             *         description: Date de fin (format ISO)
             *       - in: query
             *         name: type
             *         schema:
             *           type: string
             *           enum: [INCOME, EXPENSE]
             *       - in: query
             *         name: categoryId
             *         schema:
             *           type: integer
             *       - in: query
             *         name: budgetId
             *         schema:
             *           type: integer
             *       - in: query
             *         name: envelopeId
             *         schema:
             *           type: integer
             *       - in: query
             *         name: groupId
             *         schema:
             *           type: integer
             *       - in: query
             *         name: scheduleId
             *         schema:
             *           type: integer
             *       - in: query
             *         name: page
             *         schema:
             *           type: integer
             *           default: 1
             *       - in: query
             *         name: pageSize
             *         schema:
             *           type: integer
             *           default: 20
             *           maximum: 200
             *     responses:
             *       200:
             *         description: Liste des transactions
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'get',
                path: '/',
                middlewares: [
                    AuthMiddleware.authenticateUser, validationMiddleware(ListTransactionsQueryDto, 'query')
                ],
                handler: TransactionController.list
            },
            
            /**
             * @openapi
             * /transactions/schedules:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Transaction
             *     summary: Récupérer les schedules du mois actuel
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *     responses:
             *       200:
             *         description: Récuperer
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'get',
                path: '/schedules',
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: TransactionController.listSchedule
            },
            /**
             * @openapi
             * /transactions:
             *   post:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Transaction
             *     summary: Creer une transaction
             *     description: Cree une transaction reliee a l'utilisateur et renvoie l'objet cree dans la cle transaction.
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             $ref: '#/components/schemas/CreateTransactionDto'
             *     responses:
             *       201:
             *         description: Transaction creee
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'post',
                path: '/',
                middlewares: [
                    AuthMiddleware.authenticateUser, validationMiddleware(CreateTransactionDto, 'body')
                ],
                handler: TransactionController.create
            },
            /**
             * @openapi
             * /transactions/{id}:
             *   get:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Transaction
             *     summary: Recuperer une transaction par son identifiant
             *     description: Verifie l'id et retourne la transaction si elle appartient a l'utilisateur.
             *     parameters:
             *       - in: path
             *         name: id
             *         required: true
             *         schema:
             *           type: integer
             *     responses:
             *       200:
             *         description: Transaction trouvee
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'get',
                path: '/:id',
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: TransactionController.getById
            },
            /**
             * @openapi
             * /transactions/{id}:
             *   put:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Transaction
             *     summary: Mettre a jour une transaction
             *     description: Met a jour la transaction cible avec les champs transmis puis retourne la transaction mise a jour.
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
             *             $ref: '#/components/schemas/UpdateTransactionDto'
             *     responses:
             *       200:
             *         description: Transaction mise a jour
             *       401:
             *         description: Non authentifie
             */
            {
                method: 'put',
                path: '/:id',
                middlewares: [
                    AuthMiddleware.authenticateUser, validationMiddleware(UpdateTransactionDto, 'body')
                ],
                handler: TransactionController.update
            },
            /**
             * @openapi
             * /transactions/{id}:
             *   delete:
             *     security:
             *       - bearerAuth: []
             *     tags:
             *       - Transaction
             *     summary: Supprimer une transaction
             *     description: Verifie l'existence de la transaction puis la supprime definitivement.
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
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: TransactionController.remove
            },
        ]
    }
}
    
export default new TransactionRouter().router;