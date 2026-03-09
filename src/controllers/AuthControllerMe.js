import User from "../models/user.model.js";
// bcryptjs is already installed in package.json; use it instead of bcrypt
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary, { isConfigured } from "../config/cloudinary.js";
import fs from "fs";

// Register
export const registerUser = async (req, res) => {
    try {
        const { user_name, email, password, phone } = req.body;

        if (!user_name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            const field = existingUser.email === email ? "Email" : "Phone number";
            return res.status(400).json({ success: false, message: `${field} already exists` });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Avatar image is required" });
        }

        let avatarUrl = "";
        if (isConfigured()) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "avatars",
                    resource_type: "image"
                });
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                if (result) {
                    avatarUrl = result.secure_url;
                }
            } catch (uploadError) {
                console.warn("⚠️ Cloudinary upload failed (check .env credentials). Falling back to local storage.");
                avatarUrl = `/uploads/images/${req.file.filename}`;
            }
        } else {
            // Fallback to local upload
            avatarUrl = `/uploads/images/${req.file.filename}`;
        }

        if (!avatarUrl) {
            return res.status(500).json({ success: false, message: "Failed to upload avatar" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            user_name,
            email,
            password: hashedPassword,
            phone,
            avatar: avatarUrl
        });

        res.status(201).json({
            success: true,
            message: "Registered successfully"
        });
    } catch (error) {
        console.error("registerUser error:", error);

        // Handle Mongoose Validation Error
        if (error.name === "ValidationError") {
            const message = Object.values(error.errors).map(val => val.message).join(", ");
            return res.status(400).json({ success: false, message });
        }

        // Handle Duplicate Key Error (code 11000)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue || error.keyPattern || {})[0];
            const message = field ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` : "User already exists";
            return res.status(400).json({ success: false, message });
        }

        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

// Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Wrong password" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { httpOnly: true });
        res.json({ success: true, message: "Login successful" });
    } catch (error) {
        console.error("loginUser error:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};

// Dashboard (Protected)
export const dashboard = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ success: true, users });
    } catch (error) {
        console.error("dashboard error:", error);
        res.status(500).json({ success: false, message: error.message || "Could not fetch users" });
    }
};