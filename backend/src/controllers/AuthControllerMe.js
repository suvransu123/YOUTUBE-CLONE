import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary, { isConfigured } from "../config/cloudinary.js";
import validator from "validator";
import crypto from "crypto";
import { sendVerificationEmail } from "../config/mailer.js";

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER USER
// ─────────────────────────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    const { user_name, email, password, phone } = req.body;

    // ── 1. Validation ────────────────────────────────────────────────────
    if (!user_name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (!validator.isMobilePhone(phone, "any")) {
      return res.status(400).json({ success: false, message: "Invalid phone number" });
    }

    // ── 2. Avatar check ──────────────────────────────────────────────────
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Avatar image is required" });
    }

    // ── 3. Duplicate check ───────────────────────────────────────────────
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { phone }],
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase().trim()
        ? "Email" : "Phone number";
      return res.status(409).json({ success: false, message: `${field} already exists` });
    }

    // ── 4. Cloudinary upload ─────────────────────────────────────────────
    let avatarUrl = "";

    if (isConfigured()) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "avatars", resource_type: "image",
              transformation: [
                { width: 300, height: 300, crop: "fill" },
                { quality: "auto" },
              ],
            },
            (error, result) => { if (error) reject(error); else resolve(result); }
          ).end(req.file.buffer);
        });
        avatarUrl = result.secure_url;
      } catch (uploadErr) {
        console.warn("⚠️ Cloudinary failed:", uploadErr.message);
        avatarUrl = `/uploads/avatars/${Date.now()}_${req.file.originalname}`;
      }
    } else {
      avatarUrl = `/uploads/avatars/${Date.now()}_${req.file.originalname}`;
    }

    // ── 5. Hash password ─────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── 6. Generate verification token ───────────────────────────────────
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const verificationTokenExpires = Date.now() + 30 * 60 * 1000;   // 30 minutes

    // ── 7. Save user ─────────────────────────────────
    const newUser = await User.create({
      user_name:  user_name.trim(),
      email:      email.toLowerCase().trim(),
      password:   hashedPassword,
      phone,
      avatar:     avatarUrl,
      isVerified:              false,
      verificationTokenHash,
      verificationTokenExpires,
    });

    // ── 8. Send verification email ────────────────────────────────────────
    try {
      await sendVerificationEmail(newUser.email, newUser.user_name, verificationToken);
    } catch (emailErr) {
      console.error("❌ Email send failed:", emailErr.message);
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }

    return res.status(201).json({
      success: true,
      message: `Account created! Check ${newUser.email} for the verification link.`,
    });

  } catch (error) {
    console.error("registerUser error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// VERIFY EMAIL
// ─────────────────────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const { email } = req.query;

    if (!token) {
      return res.status(400).json({ success: false, message: "Verification token is missing." });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    let user;
    if (email) {
      user = await User.findOne({ 
        email: email.toLowerCase().trim(),
        verificationTokenHash: tokenHash 
      });
    } else {
      user = await User.findOne({ verificationTokenHash: tokenHash });
    }
    
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification link." });
    }

    if (user.isVerified) {
      return res.status(200).json({ success: true, message: "Account already verified. You can log in." });
    }

    if (Date.now() > user.verificationTokenExpires) {
      return res.status(400).json({ success: false, message: "Link expired. Please register again." });
    }

    user.isVerified = true;
    user.verificationTokenHash = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    console.error("verifyEmail error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN  (User + Admin unified)
// ─────────────────────────────────────────────────────────────────────────────
const getModel = (role) => {
  if (role === "admin") return Admin;
  return User;
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role = "user" } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const Model = getModel(role);
    const account = await Model.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!account) {
      return res.status(404).json({ success: false, message: `No ${role} account found with this email` });
    }

    if (role === "user" && !account.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email first." });
    }

    if (role === "admin" && !account.isActive) {
      return res.status(403).json({ success: false, message: "This admin account is deactivated." });
    }

    if (account.isLocked && account.lockUntil > Date.now()) {
      const mins = Math.ceil((account.lockUntil - Date.now()) / 60000);
      return res.status(423).json({ success: false, message: `Account locked. Try again in ${mins} minute(s).` });
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      account.loginAttempts = (account.loginAttempts || 0) + 1;
      if (account.loginAttempts >= 5) {
        account.isLocked  = true;
        account.lockUntil = Date.now() + 15 * 60 * 1000;
        await account.save();
        return res.status(423).json({ success: false, message: "Account locked after 5 failed attempts." });
      }
      await account.save();
      return res.status(401).json({ success: false, message: `Wrong password. ${5 - account.loginAttempts} attempt(s) remaining.` });
    }

    account.loginAttempts = 0;
    account.isLocked      = false;
    account.lockUntil     = null;
    if (role === "admin") account.lastLogin = new Date();
    await account.save();

    const token = jwt.sign(
      { id: account._id, role: account.role },
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
      success:  true,
      message:  "Login successful",
      account: {
        id:        account._id,
        user_name: account.user_name,
        email:     account.email,
        role:      account.role,
        avatar:    account.avatar,
      },
    });

  } catch (error) {
    console.error("loginUser error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────────────────────────
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("logoutUser error:", error);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export const dashboard = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.error("dashboard error:", error);
    res.status(500).json({ success: false, message: "Could not fetch users" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export const adminDashboard = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json({ success: true, admins });
  } catch (error) {
    console.error("adminDashboard error:", error);
    res.status(500).json({ success: false, message: "Could not fetch admins" });
  }
};