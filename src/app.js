import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import cors from 'cors';
import User from './models/user.model.js';
connectDB();
dotenv.config();
const app = express(); // Initialize app

// Connect to database


// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/api/v1/', async(req, res) => {
  try{
     const doctors = [
    {
      name: "Rahul Sharma",
      age: 32,
      gender: "Male",
      phone: "9876543210",
      address: "Delhi",
      bloodGroup: "B+",
      createdAt: "2026-02-01"
    },
    {
      name: "Priya Verma",
      age: 27,
      gender: "Female",
      phone: "9123456780",
      address: "Mumbai",
      bloodGroup: "A+",
      createdAt: "2026-02-05"
    },
    {
      name: "Amit Singh",
      age: 45,
      gender: "Male",
      phone: "9988776655",
      address: "Lucknow",
      bloodGroup: "O-",
      createdAt: "2026-02-10"
    }
  ];
    res.status(200).json(doctors);
}
catch(error){
    res.status(500).json({ message: error.message });
}});


app.post("/api/v1/register", async (req, res) => {
  try {
    const { user_name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Create new user
    const user = await User.create({
      user_name,
      email,
      password,
      phone
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
app.get("/api/vite/user-dashboard", async (req, res) => {
  try {
    // Example: fetch users from DB
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
export default app;  
// Server
