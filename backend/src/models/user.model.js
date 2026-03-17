// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ── Basic Info ──────────────────────────────────────────────────────
    user_name: {
      type:     String,
      required: [true, "Username is required"],
      trim:     true,
    },

    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
      index:     true,   // faster lookup by email
    },

    password: {
      type:     String,
      required: [true, "Password is required"],
      select:   false,   // never returned in queries by default
    },

    phone: {
      type:     String,
      required: [true, "Phone is required"],
      unique:   true,
      trim:     true,
    },

    avatar: {
      type:     String,
      required: [true, "Avatar is required"],
    },

    // ── Role ────────────────────────────────────────────────────────────
    role: {
      type:    String,
      enum:    ["USER", "ADMIN"],
      default: "USER",
    },

    // ── Email Verification ───────────────────────────────────────────────
    isVerified: {
      type:    Boolean,
      default: false,     // false until user clicks link
    },

    verificationTokenHash: {
      type:    String,
      default: null,      // hashed token saved here
    },

    verificationTokenExpires: {
      type:    Date,
      default: null,      // cleared after verification
    },

    // ── Login Attempts & Lock ────────────────────────────────────────────
    loginAttempts: {
      type:    Number,
      default: 0,         // increments on wrong password
    },

    isLocked: {
      type:    Boolean,
      default: false,     // true after 5 failed attempts
    },

    lockUntil: {
      type:    Date,
      default: null,      // locked until this time
    },

    // ── Account Status ───────────────────────────────────────────────────
    isBlocked: {
      type:    Boolean,
      default: false,     // admin can block user
    },
  },
  { timestamps: true }   // adds createdAt + updatedAt automatically
);

const User = mongoose.model("User", userSchema);
export default User;