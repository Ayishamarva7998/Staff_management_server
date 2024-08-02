"use strict";
import express from 'express';
import { trycatch } from '../middleware/trycatch.js';
import { createAdmin,updatePassword } from '../controllers/adminControllers.js';
import validate from '../middleware/validate.js';
import { adminSchema } from '../validation/adminValidation.js';

const router=express.Router();

router.post('/adds',validate(adminSchema),trycatch(createAdmin));
router.put('/:adminid',trycatch(updatePassword));

export default router;