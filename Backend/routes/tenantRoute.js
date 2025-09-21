import express from "express";
import { upgradeTenantPlan, upgradeUserPlan } from "../controller/tenantController.js";
import userMiddleware from "../middleware/userMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin upgrade tenant plan
router.post("/:id/upgrade", userMiddleware, adminMiddleware, upgradeTenantPlan);

// Admin upgrade specific user plan
router.post("/:tenantId/upgrade/:userId", userMiddleware, adminMiddleware, upgradeUserPlan);

export default router;
