// userRoute.js
import express from "express";
import { getTenantUsers } from "../controller/userController.js";
import userMiddleware from "../middleware/userMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Route: Admin can see all users of their tenant
router.get("/users", userMiddleware, adminMiddleware, getTenantUsers);

export default router;
