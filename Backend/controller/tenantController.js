import tenantModel from "../models/TenantModel.js";
import userModel from "../models/userModel.js";


//  Invite user (Admin only)
export const inviteUser = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Only Admin can invite users" });
    }

    const { email, name, role } = req.body;

    // Check required fields
    if (!email || !name || !role) {
      return res.status(400).json({ success: false, message: "Email, Name, and Role are required" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create temporary password
    const tempPassword = "password"; // default, can later generate random
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create user linked to Admin's tenant
    const newUser = await userModel.create({
      name,
      email,
      role,
      tenantId: req.user.tenantId,
      password: hashedPassword,
    });

    return res.json({ success: true, message: "User invited successfully", body: newUser });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Upgrade tenant plan
export const upgradeTenantPlan = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Only Admin can upgrade tenant plan" });
    }

    const tenant = await tenantModel.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ success: false, message: "Tenant not found" });
    }

    tenant.plan = "pro";
    await tenant.save();

    return res.json({ success: true, message: "Tenant plan upgraded to Pro", body: tenant });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Upgrade specific user plan
export const upgradeUserPlan = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Only Admin can upgrade user plan" });
    }

    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.plan = "pro";
    await user.save();

    return res.json({ success: true, message: "User plan upgraded to Pro", body: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
