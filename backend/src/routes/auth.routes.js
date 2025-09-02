import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { register, login, verifyOTP, verifyRegisterOTP,  requestPasswordReset,
  resetPassword, getProfile } from "../controllers/auth.controller.js";
const router = express.Router();
router.post("/register", register);
router.post("/verify-register-otp", verifyRegisterOTP);
router.post("/login", login);
router.post("/verify-login-otp", verifyOTP); 
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/profile", authMiddleware,getProfile);
export default router;
