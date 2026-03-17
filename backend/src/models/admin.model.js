// models/Admin.model.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      minlength: [3, "Username must be at least 3 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    // ── Lock protection fields (same as User model) ───────────
    loginAttempts: {
      type: Number,
      default: 0,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    // ── Admins are pre-verified (no OTP email needed) ─────────
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ── Hash password before saving ───────────────────────────────
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance method: compare password at login ────────────────
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Instance method: check if account is currently locked ─────
adminSchema.methods.isAccountLocked = function () {
  return this.isLocked && this.lockUntil > Date.now();
};

// ── Instance method: increment failed attempts / lock ─────────
adminSchema.methods.incrementLoginAttempts = async function () {
  this.loginAttempts = (this.loginAttempts || 0) + 1;

  if (this.loginAttempts >= 5) {
    this.isLocked  = true;
    this.lockUntil = Date.now() + 15 * 60 * 1000; // 15 mins
  }

  await this.save();
};

// ── Instance method: reset lock on successful login ───────────
adminSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.isLocked      = false;
  this.lockUntil     = null;
  this.lastLogin     = new Date();
  await this.save();
};

// ── Instance method: safe object (no password) ────────────────
adminSchema.methods.toSafeObject = function () {
  return {
    _id:           this._id,
    user_name:     this.user_name,
    email:         this.email,
    phone:         this.phone,
    avatar:        this.avatar,
    role:          this.role,
    isActive:      this.isActive,
    isVerified:    this.isVerified,
    lastLogin:     this.lastLogin,
    loginAttempts: this.loginAttempts,
    isLocked:      this.isLocked,
    createdAt:     this.createdAt,
  };
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;