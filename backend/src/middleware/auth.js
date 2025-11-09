// middleware/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { CatchAsyncError } from "./CatchAsyncError.js";
import ErrorHandler from "./error.js";

export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const { token } = req.cookies || {};

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

