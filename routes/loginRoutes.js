import express from 'express';
import { loginSchema } from '../validation/LoginValidation.js';
import validate from '../middleware/validate.js';
import { trycatch } from '../middleware/trycatch.js';
import { login } from '../controllers/LoginController.js';

const router= express.Router();

router.post('/login',validate(loginSchema),trycatch(login));

export default router;