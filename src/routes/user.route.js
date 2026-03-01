import express from "express";
import { registerUser, loginUser, dashboard } from "../controllers/AuthControllerMe.js";
import { verifyToken } from "../middlewares/AuthMiddlewareMe.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Dashboard (protected)
router.get("/dashboard", verifyToken, dashboard);

export default router;