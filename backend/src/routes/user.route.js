// routes/user.route.js

import express from "express";

// ── User controllers ──────────────────────────────────────────────────────
import {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  dashboard,
} from "../controllers/AuthControllerMe.js";

// ── Admin controllers ─────────────────────────────────────────────────────
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  adminDashboard,
} from "../controllers/admin.controller.js";

// ── Shared middleware & upload ────────────────────────────────────────────
import { verifyToken }    from "../middlewares/AuthMiddlewareMe.js";
import { verifyAdmin }    from "../middlewares/adminMiddleware.js";
import { uploadAvatar }   from "../controllers/uploadController.js";
import uploadImage        from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ════════════════════════════════════════════════════════════════════════════
// USER — Public Routes
// ════════════════════════════════════════════════════════════════════════════
router.post("/register",            uploadImage.single("avatar"), registerUser);
router.get ("/verify-email/:token", verifyEmail);
router.post("/login",               loginUser);

// ════════════════════════════════════════════════════════════════════════════
// USER — Protected Routes  (valid JWT required)
// ════════════════════════════════════════════════════════════════════════════
router.post("/logout",        verifyToken, logoutUser);
router.get ("/dashboard",     verifyToken, dashboard);
router.post("/upload-avatar", verifyToken, uploadImage.single("avatar"), uploadAvatar);

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — Public Routes
// ════════════════════════════════════════════════════════════════════════════
router.post("/admin/register", uploadImage.single("avatar"), registerAdmin);
router.post("/admin/login",    loginAdmin);

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — Protected Routes  (valid JWT + role === "admin" required)
// ════════════════════════════════════════════════════════════════════════════
router.post("/admin/logout",    verifyToken, verifyAdmin, logoutAdmin);
router.get ("/admin/dashboard", verifyToken, verifyAdmin, adminDashboard);

export default router;