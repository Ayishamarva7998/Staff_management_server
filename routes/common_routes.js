import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { trycatch } from '../middleware/trycatch.js';
import { getdatafromid, updatePassword } from '../controllers/common_controller.js';
import validate from '../middleware/validate.js';
import { updatePasswordSchema } from '../validation/common_validation.js';

const router= express.Router();

router.get('/profile/:Id',authenticateToken,trycatch(getdatafromid));
router.put('/password/:Id',authenticateToken,validate(updatePasswordSchema),trycatch(updatePassword));

export default router;