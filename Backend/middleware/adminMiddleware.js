const adminMiddleware = async (req, res, next) => {
 
  try {
    if (!req.user) {
      return res.json({
        success: false,
        msg: "Unauthorized: user not found",
        status: 400,
        body: {},
      });
    }

    if (req.user.role !== "Admin") {
      return res.json({
        success: false,
        msg: "Access denied: Admins only",
        status: 403,
        body: {},
      });
    }

    next();

  } catch (error) {
    console.log(error, "adminMiddleware error");
    return res.json({
      success: false,
      msg: "Something went wrong in adminMiddleware",
      status: 500,
      body: {},
    });
  }
};

export default adminMiddleware;
