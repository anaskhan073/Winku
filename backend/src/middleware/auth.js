// middleware/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { CatchAsyncError } from "./CatchAsyncError.js";
import ErrorHandler from "./error.js";

export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const { token } = req.headers || {};

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found.", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    // Clear invalid cookie
    res.cookie("token", "", { expires: new Date(0) });
    return next(new ErrorHandler("Invalid or expired token.", 401));
  }
});


export const verifyGoogleToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Attach user to request — just like isAuthenticated, but lighter
    req.user = user;
    next();
  } catch (error) {
    console.error("Google token verification failed:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};