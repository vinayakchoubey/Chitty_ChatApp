import express from "express";
import { checkAuth, login, logout, signup, updateProfile, verifyEmail, sendOtp, verifyOtp, googleCallback, forgotPassword, resetPassword, changePassword } from "../controllers/auth.controller.js";
import passport from "passport";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    (req, res, next) => {
        passport.authenticate("google", { session: false }, (err, user, info) => {
            const clientUrl = (process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",")[0] : "http://localhost:5173").trim();
            if (err || !user) {
                console.error("Google OAuth error:", err?.message || info);
                return res.redirect(`${clientUrl}/login?error=google_auth_failed`);
            }
            req.user = user;
            next();
        })(req, res, next);
    },
    googleCallback
);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", protectRoute, changePassword);

export default router;