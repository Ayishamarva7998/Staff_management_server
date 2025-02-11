"use strict";
import express from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/admin_routes.js';
import loginRoutes from './routes/login_routes.js';
import { errorHandler } from './middleware/error_middleware.js';
import staffRoutes from './routes/staffroute.js'
import commonRoutes from './routes/common_routes.js'
import cors from 'cors';
import './controllers/cronjob_contoller.js'
config();

const app=express();



app.use(express.json());
app.use(cors());

app.use('/api',loginRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/staff',staffRoutes);
app.use('/api/common',commonRoutes);
app.use(errorHandler);

connectDB();
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);    
});