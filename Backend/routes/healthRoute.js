import express from "express";
import userMiddleware from "../middleware/userMiddleware.js"; 
import Tenant from "../models/TenantModel.js";
import Note from "../models/noteModel.js";

const router = express.Router();

// GET /health
router.get("/", userMiddleware, async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) 
      return res.status(404).json({ success: false, message: "Tenant not found" });

    // Count only notes for current user
    const notesCount = await Note.countDocuments({ tenantId, user: req.user._id });

    res.json({
      success: true,
      body: {
        tenant: {
          name: tenant.name,
          plan: tenant.plan,
        },
        notesCount,
        freeLimitReached: tenant.plan === "free" && notesCount >= 3, // optional
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
