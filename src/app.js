
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/db';
dotenv.config();
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
