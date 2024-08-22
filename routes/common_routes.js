import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { trycatch } from '../middleware/trycatch.js';
import { getIdfromData } from '../controllers/common_controller.js';

const router= express.Router();

router.get('/profile/:ID',authenticateToken,trycatch(getIdfromData));

export default router;