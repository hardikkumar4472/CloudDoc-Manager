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

    const token = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" });

    res.json({ 
      msg: "Login successful", 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
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

export const updateName = async (req, res) => {
  try {
    const { name } = req.body;
    await User.findByIdAndUpdate(req.userId, { name });
    res.json({ msg: "Name updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating name", error: err.message });
  }
};

export const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    
    // Check if email already used
    const existing = await User.findOne({ email: newEmail });
    if (existing) {
        return res.status(400).json({ msg: "This email is already associated with an account." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await User.findByIdAndUpdate(req.userId, {
        newEmail,
        newEmailOtp: otp,
        newEmailOtpExpires: Date.now() + 10 * 60 * 1000 // 10 mins
    });

    await sendOTP(newEmail, otp);

    res.json({ msg: `OTP sent to ${newEmail}` });
  } catch (err) {
    res.status(500).json({ msg: "Error requesting email change", error: err.message });
  }
};

export const verifyEmailChange = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.userId);

    if (!user.newEmailOtp || String(user.newEmailOtp) !== String(otp) || Date.now() > user.newEmailOtpExpires) {
        return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Double check uniqueness just in case
    const existing = await User.findOne({ email: user.newEmail });
    if (existing) return res.status(400).json({ msg: "Email already taken" });

    user.email = user.newEmail;
    user.newEmail = undefined;
    user.newEmailOtp = undefined;
    user.newEmailOtpExpires = undefined;
    await user.save();

    res.json({ msg: "Email updated successfully" });
  } catch (err) {
      res.status(500).json({ msg: "Error verifying email change", error: err.message });
  }
};

export const requestPasswordChange = async (req, res) => {
  try {
    const { oldPassword } = req.body;
    const user = await User.findById(req.userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect current password" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOTP(user.email, otp); // Send to CURRENT email

    res.json({ msg: "OTP sent to your email to confirm password change" });
  } catch (err) {
      res.status(500).json({ msg: "Error processing request", error: err.message });
  }
};

export const verifyPasswordChange = async (req, res) => {
  try {
      const { otp, newPassword } = req.body;
      const user = await User.findById(req.userId);

      if (String(user.otp) !== String(otp) || Date.now() > user.otpExpires) {
          return res.status(400).json({ msg: "Invalid or expired OTP" });
      }

      if (newPassword.length < 6) return res.status(400).json({ msg: "Password too short" });

      user.password = await bcrypt.hash(newPassword, 10);
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      res.json({ msg: "Password updated successfully" });
  } catch (err) {
      res.status(500).json({ msg: "Error updating password", error: err.message });
  }
};


export const setVaultPin = async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin || pin.length !== 4) {
      return res.status(400).json({ msg: "PIN must be 4 digits" });
    }

    const hashedPin = await bcrypt.hash(pin, 10);
    await User.findByIdAndUpdate(req.userId, { vaultPin: hashedPin });
    res.json({ msg: "Vault PIN set successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error setting PIN", error: err.message });
  }
};

export const verifyVaultPin = async (req, res) => {
  try {
    const { pin } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user.vaultPin) return res.status(400).json({ msg: "No PIN set" });

    const isMatch = await bcrypt.compare(pin, user.vaultPin);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect PIN" });

    res.json({ success: true, msg: "PIN Verified" });
  } catch (err) {
    res.status(500).json({ msg: "Server error verifying PIN", error: err.message });
  }
};

export const checkVaultStatus = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.json({ hasPin: !!user.vaultPin });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};
