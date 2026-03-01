import User from "../models/user.model.js";
// bcryptjs is already installed in package.json; use it instead of bcrypt
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const registerUser = async (req, res) => {
    try {
        const { user_name, email, password, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            user_name,
            email,
            password: hashedPassword,
            phone
        });

        // return a consistent response shape for the frontend
        res.status(201).json({
            success: true,
            message: "Registered successfully"
        });
    } catch (error) {
        console.error("registerUser error:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
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
    const users = await User.find().select("-password");
    res.json({ success: true, users });
};