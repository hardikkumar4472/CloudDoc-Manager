import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOTP } from "../services/email.service.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ 
        success: false,
        msg: "All fields are required" 
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        msg: "Please provide a valid email address" 
      });
    }
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        msg: "Password must be at least 6 characters long" 
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        msg: "User already exists with this email" 
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    await user.save();
    await sendOTP(user.email, otp);
    res.status(201).json({ 
      success: true,
      msg: "User registered successfully. OTP sent to email.",
      data: {
        email: user.email 
      }
    });

  } catch (err) {
    console.error("Registration error:", err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        msg: "Validation error",
        error: err.message 
      });
    }
    
    if (err.code === 11000) { 
      return res.status(400).json({ 
        success: false,
        msg: "User already exists" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      msg: "Error registering user",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

export const verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (String(user.otp) !== String(otp) || new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ msg: "Email verified successfully. You can now login." });
  } catch (err) {
    res.status(500).json({ msg: "Error verifying OTP", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    if (!user.isVerified) return res.status(400).json({ msg: "Please verify your email first." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();
    await sendOTP(user.email, otp);
    res.json({ msg: "OTP sent to email for login" });
  } catch (err) {
    res.status(500).json({ msg: "Error logging in", error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (String(user.otp) !== String(otp) || new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" });

    res.json({ msg: "Login successful", token });
  } catch (err) {
    res.status(500).json({ msg: "Error verifying OTP", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (
      String(user.otp) !== String(otp) ||
      new Date() > new Date(user.otpExpires)
    ) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ msg: "Password reset successful. You can now login." });
  } catch (err) {
    res.status(500).json({ msg: "Error resetting password", error: err.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();
    await sendOTP(user.email, otp);

    res.json({ msg: "OTP sent to your email for password reset" });
  } catch (err) {
    res.status(500).json({ msg: "Error sending reset OTP", error: err.message });
  }
};

