"use strict";
import express from 'express';
import { trycatch } from '../middleware/trycatch.js';
import { createAdmin,updatePassword } from '../controllers/adminControllers.js';
import validate from '../middleware/validate.js';
import { adminSchema } from '../validation/adminValidation.js';
import { deleteMentor, staffsadd, viewAdvisor, viewMentor } from '../controllers/staffControllers.js';
import staffValidationSchema from '../validation/staffValidation.js';

const router=express.Router();

router.post('/adds',validate(adminSchema),trycatch(createAdmin));
router.put('/:adminid',trycatch(updatePassword));
//   add staffs in admin page
router.post('/staff', validate(staffValidationSchema),trycatch(staffsadd));
// show mentor and advisor
router.get('/mentor',trycatch(viewMentor));
router.get('/advisor',trycatch(viewAdvisor));


// delete  mentor and advisor

router.delete('/advisor/:mentorid',trycatch(deleteMentor));
// admin side search for 
export default router;