"use strict";
import express from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import cors from 'cors';

config();

const app=express();

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE',  // Allowed methods
    allowedHeaders: 'Content-Type,Authorization' // Allowed headers
  }));

app.use(express.json());

connectDB();

app.use('/api',loginRoutes);
app.use('/api/admin',adminRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port,()=>{
console.log(`Server is running on http://localhost:${port}`);
});