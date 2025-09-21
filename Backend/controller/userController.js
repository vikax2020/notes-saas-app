import userModel from "../models/userModel.js";
 

export const getTenantUsers = async (req, res) => {
  console.log("Decoded User from Token:", req.user);

  
  try {
    const tenantId = req.user.tenantId; // token se
    const users = await userModel.find({ tenantId });

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found for this tenant",
        body: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tenant users fetched successfully",
      body: users,
    });

  } catch (error) {
    console.error(error, "getTenantUsers error");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      body: [],
    });
  }
};

