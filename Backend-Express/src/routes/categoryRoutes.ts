import BaseRouter, { RouteConfig } from "./base.router";
import AuthMiddleware from "../middlewares/auth.middleware";
import CategoryController from "../controllers/category.controller";

class CategoryRouter extends BaseRouter {
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
       *     Category:
       *       type: object
       *       properties:
       *         id:
       *           type: integer
       *           format: int32
       *         name:
       *           type: string
       *       required: [id, name]
       *     CategoryCreateInput:
       *       type: object
       *       properties:
       *         name:
       *           type: string
       *           example: Salaire
       *       required: [name]
       *     CategoryUpdateInput:
       *       type: object
       *       properties:
       *         name:
       *           type: string
       *           example: Courses
       */

      /**
       * @openapi
       * /categories:
       *   get:
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - Category
       *     summary: Lister les categories de l'utilisateur
       *     responses:
       *       200:
       *         description: Liste des categories
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 categories:
       *                   type: array
       *                   items:
       *                     $ref: '#/components/schemas/Category'
       *       400:
       *         description: Parametre invalide
       *       401:
       *         description: Non authentifie
       *   post:
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - Category
       *     summary: Creer une categorie
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/CategoryCreateInput'
       *     responses:
       *       201:
       *         description: Categorie creee
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 category:
       *                   $ref: '#/components/schemas/Category'
       *       400:
       *         description: Donnees invalides
       *       401:
       *         description: Non authentifie
       *       409:
       *         description: La categorie existe deja
       */
      {
        method: "get",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser],
        handler: CategoryController.list,
      },
      {
        method: "post",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser],
        handler: CategoryController.create,
      },

      /**
       * @openapi
       * /categories/{id}:
       *   get:
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - Category
       *     summary: Recuperer une categorie par id
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: integer
       *           format: int32
       *     responses:
       *       200:
       *         description: Categorie trouvee
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 category:
       *                   $ref: '#/components/schemas/Category'
       *       400:
       *         description: Identifiant invalide
       *       401:
       *         description: Non authentifie
       *       404:
       *         description: Categorie introuvable
       *   put:
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - Category
       *     summary: Mettre a jour une categorie
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: integer
       *           format: int32
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/CategoryUpdateInput'
       *     responses:
       *       200:
       *         description: Categorie mise a jour
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 category:
       *                   $ref: '#/components/schemas/Category'
       *       400:
       *         description: Donnees invalides ou id invalide
       *       401:
       *         description: Non authentifie
       *       404:
       *         description: Categorie introuvable
       *       409:
       *         description: La categorie existe deja
       *   delete:
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - Category
       *     summary: Supprimer une categorie
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: integer
       *           format: int32
       *     responses:
       *       204:
       *         description: Supprimee
       *       400:
       *         description: Identifiant invalide
       *       401:
       *         description: Non authentifie
       *       404:
       *         description: Categorie introuvable
       */
      {
        method: "get",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser],
        handler: CategoryController.getById,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser],
        handler: CategoryController.update,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser],
        handler: CategoryController.remove,
      },
    ];
  }
}

export default new CategoryRouter().router;
