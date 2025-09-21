import userModel from "../models/userModel.js";
import tenantModel from "../models/TenantModel.js";
import bcrypt from "bcrypt";
import Token from "../Token/TokenGen.js";

export const userSignup = async (req, res) => {
  try {
    const { name, email, password, role, tenantName, tenantId } = req.body;

    // user already exists
    const findEmail = await userModel.findOne({ email });
    if (findEmail) {
      return res.json({ success: false, status: 400, message: "User already exists" });
    }

    let finalTenantId = tenantId; 

    
    if (role === "Admin" && tenantName) {
      console.log("Creating new tenant for:", tenantName);
      const newTenant = await tenantModel.create({ name: tenantName });
      finalTenantId = newTenant._id;
    }

    if (!finalTenantId) {
      return res.json({ success: false, status: 400, message: "tenantId required for member signup" });
    }

    // encrypt password
    const encPass = await bcrypt.hash(password, 10);

    // create user
    let userData = await userModel.create({
      name,
      email,
      password: encPass,
      role,
      tenantId: finalTenantId
    });

    // populate tenant
    await userData.populate("tenantId");

    // generate token
    const tokenCall = await Token(userData._id);
    userData.token = tokenCall.tokenGen;
    userData.loginTime = tokenCall.tokenverify.iat;
    await userData.save();

    return res.json({
      success: true,
      status: 200,
      message: "Signup successful",
      body: userData
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, status: 500, message: "Internal server error", body: {} });
  }
};


//  Login
export const userLogin = async (req, res) => {
  try {
    
    const findEmail = await userModel.findOne({ email: req.body.email });

    if (!findEmail) {
      return res.json({ success: false, status: 404, message: "Email not found", body: {} });
    }

    const checkPass = await bcrypt.compare(req.body.password, findEmail.password);

    if (!checkPass) {
      return res.json({ success: false, status: 400, message: "Password is not correct", body: {} });
    }

    // Generate new token
    const tokenCall = await Token(findEmail._id);
    findEmail.token = tokenCall.tokenGen;
    findEmail.loginTime = tokenCall.tokenverify.iat;
    await findEmail.save();

    return res.json({
      success: true,
      status: 200,
      message: "Login successful",
      body: findEmail
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, status: 500, message: "Internal server error", body: {} });
  }
};
