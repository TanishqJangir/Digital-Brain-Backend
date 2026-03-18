import express from "express";
import {
    signupController,
    signinController,
    meController,
    verifyOtpController,
    generateOtpController,
    deleteAccountController,
    updateNameController,
    updatePasswordGenerateOtpController,
    updatePasswordVerifyOtpController,
    updatePasswordController,
    forgotPasswordGenerateOtpController,
    forgotPasswordVerifyOtpController,
    forgotPasswordResetController
} from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { signupSchema, loginSchema } from "../validators/auth.validator";
import passport from "passport";
import { signToken } from "../utils/jwt";
import { env } from "../config/env";

const router = express.Router();


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));

router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${env.CLIENT_URL}/login?error=google_failed` }),
    (req, res) => {
        try {
            const user = req.user as any;
            const token = signToken({
                userId: user._id.toString(),
                email: user.email
            });
            res.redirect(`${env.CLIENT_URL}/auth-success?token=${token}`);
        } catch (err) {
            return res.redirect(`${env.CLIENT_URL}/login?error=google_failed`);
        }
    });

router.get("/github", passport.authenticate("github", { scope: ["user:email"], prompt: "login" }));

router.get("/github/callback", passport.authenticate("github", { session: false, failureRedirect: `${env.CLIENT_URL}/login?error=github_failed` }),
    (req, res) => {
        try {
            const user = req.user as any;
            const token = signToken({
                userId: user._id.toString(),
                email: user.email
            });
            res.redirect(`${env.CLIENT_URL}/auth-success?token=${token}`);
        } catch (err) {
            return res.redirect(`${env.CLIENT_URL}/login?error=github_failed`);
        }
    });

router.post("/signup", validate(signupSchema), signupController);
router.post("/signin", validate(loginSchema), signinController);
router.post("/generate-otp", generateOtpController);
router.post("/verify-otp", verifyOtpController);
router.get("/me", requireAuth, meController);
router.delete("/delete-account", requireAuth, deleteAccountController);

// Profile Update
router.put("/name", requireAuth, updateNameController);

// Password Change Flow (Authenticated)
router.post("/password-otp/generate", requireAuth, updatePasswordGenerateOtpController);
router.post("/password-otp/verify", requireAuth, updatePasswordVerifyOtpController);
router.put("/password", requireAuth, updatePasswordController);

// Forgot Password Flow (Unauthenticated)
router.post("/forgot-password/generate", forgotPasswordGenerateOtpController);
router.post("/forgot-password/verify", forgotPasswordVerifyOtpController);
router.post("/forgot-password/reset", forgotPasswordResetController);


export default router;