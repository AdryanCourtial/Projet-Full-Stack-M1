import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import categoryRoutes from "./categoryRoutes";
import transactionRoutes from "./transactionRoutes";
import dashboardRoutes from "./dashboardRoutes";
import budgetRoutes from "./budgetRoutes";
import envelopeRoutes from "./envelopeRoutes";
import scheduleRoutes from "./scheduleRoutes";
import groupRoutes from "./groupRoutes";

const router = Router();

router.use("/auth", authRoutes)
router.use("/user", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/transactions", transactionRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/budgets", budgetRoutes);
router.use("/envelopes", envelopeRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/groups", groupRoutes);

export default router;
