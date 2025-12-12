import { Router } from "express";
import { createUser, getAllUsers, getUserById } from "../controllers/userController";

const router = Router();

/**
 * @openapi
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get All Users
 *     description: Returns  a list of all users.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All users retrieved successfully"
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllUsers);

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User by ID
 *     description: Returns a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', getUserById);

/**
 * @openapi
 * /user:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new User
 *     description: Creates a new user with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: User created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post("/", createUser);


export default router;
