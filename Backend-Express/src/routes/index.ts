import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/auth", authRoutes)
router.use("/user", userRoutes);

export default router;
