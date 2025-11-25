import express from "express";
import { register, emailverifyOTP, resendEmailOTP, login, logout, getUser, forgotPassword, resetPassword, checkAuth } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.js";
import passport from "passport";
import jwt from "jsonwebtoken";

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
router.get("/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        try {
            const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.redirect(`${process.env.FRONTEND_URL}/google-auth-success?token=${token}`);
        } catch (error) {
            console.error("Error during Google authentication callback:", error);
            res.redirect(`${process.env.FRONTEND_URL}/google-auth-failure`);
        }
    });

    router.get("/protected", isAuthenticated, (req, res) => {
        res.json({ success: true, user: req.user });
    });


export default router;

