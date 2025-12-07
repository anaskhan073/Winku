import express from "express";
import { register, emailverifyOTP, resendEmailOTP, login, logout, getUser, forgotPassword, resetPassword, checkAuth, completeGoogleRegister, googleCallback } from "../controllers/auth.controller.js";
import { isAuthenticated, verifyGoogleToken } from "../middleware/auth.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { User } from '../models/user.model.js'

const router = express.Router();

router.post("/register", register);
router.post("/email-otp-verification", emailverifyOTP);
router.post("/resend-email-otp", resendEmailOTP);
router.post("/login", login);
router.get("/logout", logout);
router.get("/get-user", isAuthenticated, getUser);
router.post("/forget-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/check-auth", checkAuth);

// Google login Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get( "/google/callback", passport.authenticate("google", { session: false }), googleCallback);
router.post("/complete-google-register", verifyGoogleToken, completeGoogleRegister);


export default router;

