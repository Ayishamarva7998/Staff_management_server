"use strict";
import express from 'express';
import { trycatch } from '../middleware/trycatch.js';
import { createAdmin,updatePassword } from '../controllers/adminControllers.js';
import validate from '../middleware/validate.js';
import { adminSchema } from '../validation/adminValidation.js';
import { deleteAdvisor, getstaffs, searchStaff, staffsadd, updatestaff, viewAdvisor, viewReviewer } from '../controllers/staffControllers.js';
import staffValidationSchema from '../validation/staffValidation.js';
import { payment } from '../controllers/paymentControllers.js';
import { adminMeetings } from '../controllers/adminMeetingControllers.js';
import { authenticateToken } from '../middleware/auth.js';
import meetingSchema from '../validation/meeting_validation.js';


const router=express.Router();

router.post('/adds',validate(adminSchema),trycatch(createAdmin));
router.put('/:adminid',authenticateToken,trycatch(updatePassword));
//   add staffs in admin page
router.post('/staff',trycatch(staffsadd));
//  edit staffs details
router.patch('/:staffid',authenticateToken,trycatch(updatestaff));

// show Advisor and advisor
router.get('/advisor',authenticateToken,trycatch(viewAdvisor));
router.get('/reviewer',authenticateToken,trycatch(viewReviewer));



// delete  Advisor and advisor

router.delete('/advisor/:advisorid',authenticateToken,trycatch(deleteAdvisor));
// admin side search  box
router.get('/search',authenticateToken, trycatch(searchStaff));

//payment for reviewer
router.post('/payment/:paymentid',authenticateToken,trycatch(payment))


// for the Group meetings  email
router.post('/meetings',authenticateToken,trycatch(adminMeetings));

// get all staffs 
router.get('/staffs',authenticateToken,trycatch(getstaffs));
export default router;