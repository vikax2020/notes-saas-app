import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userMiddleware = async (req, res, next) => {
  
  try {
    const token = req.headers.authorization;
    console.log(token, "token");

    if (!token) {
      return res.json({
        success: false,
        msg: "No token provided",
        status: 401,
        body: {},
      });
    }

    // Bearer token split
    const splitToken = token.split(" ")[1];
    console.log(splitToken, "extracted token");

    // Verify token
    const tokenVerify = jwt.verify(splitToken, process.env.SECKEY);
    console.log(tokenVerify, "tokenverify");

    const userGet = await userModel.findById(tokenVerify.id);
    console.log(userGet, "userget");

    if (!userGet || splitToken !== userGet.token) {
      return res.json({
        success: false,
        msg: "Please login again",
        status: 400,
        body: {},
      });
    }

    req.user = userGet; 
    next();

  } catch (error) {
    console.log(error, "userMiddleware error");
    return res.json({
      success: false,
      msg: "Invalid token",
      status: 401,
      body: {},
    });
  }
};

export default userMiddleware;
