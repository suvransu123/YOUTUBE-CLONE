// controllers/admin.controller.js

import Admin  from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt    from "jsonwebtoken";

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER ADMIN
// ─────────────────────────────────────────────────────────────────────────────
export const registerAdmin = async (req, res) => {
  try {
    const { user_name, email, password, phone, admin_key } = req.body;

    if (!user_name || !email || !password || !phone || !admin_key) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (admin_key !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        message: "Invalid Admin Secret Key",
      });
    }

    // ── check duplicate ───────────────────────────────────────────────
    const exists = await Admin.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { user_name }],
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: exists.email === email.toLowerCase().trim()
          ? "Email already registered as admin"
          : "Username already taken",
      });
    }

    // ── avatar path from multer ───────────────────────────────────────
    const avatar = req.file?.path ?? "";

    const admin = new Admin({
      user_name,
      email:    email.toLowerCase().trim(),
      password,           // hashed by pre("save") in model
      phone,
      avatar,
      role: "admin",
    });

    await admin.save();

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      admin:   admin.toSafeObject(),
    });

  } catch (error) {
    console.error("registerAdmin error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN ADMIN
// ─────────────────────────────────────────────────────────────────────────────
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ── fetch WITH password ───────────────────────────────────────────
    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "No admin account found with this email",
      });
    }

    // ── deactivated check ─────────────────────────────────────────────
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "This admin account has been deactivated",
      });
    }

    // ── lock check ────────────────────────────────────────────────────
    if (admin.isAccountLocked()) {
      const mins = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account locked. Try again in ${mins} minute(s).`,
      });
    }

    // ── compare password ──────────────────────────────────────────────
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      await admin.incrementLoginAttempts();   // model method
      const remaining = 5 - admin.loginAttempts;

      if (admin.isLocked) {
        return res.status(423).json({
          success: false,
          message: "Account locked after 5 failed attempts. Try again in 15 minutes.",
        });
      }

      return res.status(401).json({
        success: false,
        message: `Wrong password. ${remaining} attempt(s) remaining.`,
      });
    }

    // ── success → reset attempts + update lastLogin ───────────────────
    await admin.resetLoginAttempts();         // model method

    // ── sign JWT ──────────────────────────────────────────────────────
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge:   24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin:   admin.toSafeObject(),
    });

  } catch (error) {
    console.error("loginAdmin error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGOUT ADMIN
// ─────────────────────────────────────────────────────────────────────────────
export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge:   24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });

  } catch (error) {
    console.error("logoutAdmin error:", error);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD  — lists all users + all admins
// ─────────────────────────────────────────────────────────────────────────────
export const adminDashboard = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");

    return res.status(200).json({
      success: true,
      admins,
    });

  } catch (error) {
    console.error("adminDashboard error:", error);
    return res.status(500).json({ success: false, message: "Could not fetch data" });
  }
};
