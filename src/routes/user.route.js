import express from "express";
import { registerUser, loginUser, dashboard } from "../controllers/AuthControllerMe.js";
import { verifyToken } from "../middlewares/AuthMiddlewareMe.js";
import { uploadAvatar } from "../controllers/uploadController.js";
import uploadImage from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Register
router.post("/register", uploadImage.single("avatar"), registerUser);

// Login
router.post("/login", loginUser);

// Dashboard (protected)
router.get("/dashboard", verifyToken, dashboard);

// Upload avatar
router.post("/upload-avatar", uploadImage.single("avatar"), uploadAvatar);

export default router;