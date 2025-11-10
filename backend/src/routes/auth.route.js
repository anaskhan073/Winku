import express from "express";
import { register, emailverifyOTP, login, logout, getUser, forgotPassword, resetPassword, checkAuth } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/email-otp-verification", emailverifyOTP);
router.post("/login", login);
router.get("/logout", logout);
router.get("/get-user", isAuthenticated, getUser);
router.post("/forget-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/check-auth", checkAuth);

export default router;

