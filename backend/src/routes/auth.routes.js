import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { 
  register, login, verifyOTP, verifyRegisterOTP, requestPasswordReset,
  resetPassword, getProfile, updateName, requestEmailChange, verifyEmailChange,
  requestPasswordChange, verifyPasswordChange, setVaultPin, verifyVaultPin, checkVaultStatus,
  enable2FA, verify2FA, login2FA, disable2FA
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-register-otp", verifyRegisterOTP);
router.post("/login", login);
router.post("/login-2fa", login2FA);
router.post("/verify-login-otp", verifyOTP); 
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

router.get("/profile", authMiddleware, getProfile);
router.patch("/update-name", authMiddleware, updateName);
router.post("/request-email-change", authMiddleware, requestEmailChange);
router.post("/verify-email-change", authMiddleware, verifyEmailChange);
router.post("/request-password-change", authMiddleware, requestPasswordChange);
router.post("/verify-password-change", authMiddleware, verifyPasswordChange);

// Vault PIN
router.post("/vault/set-pin", authMiddleware, setVaultPin);
router.post("/vault/verify-pin", authMiddleware, verifyVaultPin);
router.get("/vault/status", authMiddleware, checkVaultStatus);

// 2FA
router.post("/2fa/enable", authMiddleware, enable2FA);
router.post("/2fa/verify", authMiddleware, verify2FA);
router.post("/2fa/disable", authMiddleware, disable2FA);

export default router;
