import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.header.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    return next(new Error("Authorization failed"));
  }

  try {
    const decode = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findById(decode.id).select("-password");
    if(!user){
      res.status(401);
      return next(new Error("Authorization failed"));
    }
    res.user = user;
    next();
  } catch (error) {
     res.status(401);
     return next(new Error("Not authorized, token failed"));
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
}
