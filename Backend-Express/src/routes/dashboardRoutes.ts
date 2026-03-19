import DashboardController from "../controllers/dashboard.controller";
import { DashboardMonthlyQueryDto } from "../dto/dashboard.dto";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import BaseRouter, { RouteConfig } from "./base.router";

class DashboardRouter extends BaseRouter {
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
                 *     DashboardMonthlyQueryDto:
                 *       type: object
                 *       properties:
                 *         month:
                 *           type: string
                 *           description: Format YYYY-MM
                 *         from:
                 *           type: string
                 *           format: date
                 *         to:
                 *           type: string
                 *           format: date
                 * /dashboard/monthly:
                 *   get:
                 *     security:
                 *       - bearerAuth: []
                 *     tags:
                 *       - Dashboard
                 *     summary: Recuperer les indicateurs mensuels du dashboard
                 *     description: Retourne les donnees agregees en filtrant sur month (YYYY-MM) et/ou un intervalle from/to.
                 *     parameters:
                 *       - in: query
                 *         name: month
                 *         schema:
                 *           type: string
                 *         description: Mois cible au format YYYY-MM
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
                 *         description: Resume mensuel
                 *       401:
                 *         description: Non authentifie
                 */
                {
                    method: 'get',
                    path: '/monthly',
                    middlewares: [ AuthMiddleware.authenticateUser, validationMiddleware(DashboardMonthlyQueryDto, 'query') ],
                    handler: DashboardController.monthly
                }
            ]
        }
}

export default new DashboardRouter().router;