import express from 'express';
import { login } from '../controllers/loginController.js';
import { loginSchema } from '../validation/LoginValidation.js';
import validate from '../middleware/validate.js';
import { trycatch } from '../middleware/trycatch.js';

const router= express.Router();

router.post('/login',validate(loginSchema),trycatch(login));

export default router;