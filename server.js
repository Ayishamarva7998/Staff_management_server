"use strict";
import express from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';


config();

const app=express();

app.use(express.json());

connectDB();

app.use('/api/admin',adminRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port,()=>{
console.log(`Server is running on http://localhost:${port}`);
});