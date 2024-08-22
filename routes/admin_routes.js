"use strict";
import express from 'express';
import { trycatch } from '../middleware/trycatch.js';
import { add_batche, add_stack, createAdmin,delete_batch,delete_stack } from '../controllers/admin_controller.js';
import validate from '../middleware/validate.js';
import { adminSchema } from '../validation/admin_validation.js';
import {   deletestaff, getstaffs, searchStaff, staffsadd, updatestaff, viewAdvisor, viewReviewer } from '../controllers/staff_controller.js';
import { payment, verifyPayment } from '../controllers/payment_controller.js';
import { adminMeetings } from '../controllers/admin_meeting-Controller.js';
import { authenticateToken } from '../middleware/auth.js';
import meetingSchema from '../validation/meeting_validation.js';
import { staffValidationSchema, updateStaffSchema } from '../validation/staff_validation.js';


const router=express.Router();

router.post('/adds',validate(adminSchema),trycatch(createAdmin));

//   add staffs in admin page
router.post('/staff',authenticateToken,validate(staffValidationSchema),trycatch(staffsadd));
//  edit staffs details
router.patch('/update/:staffid',authenticateToken,validate(updateStaffSchema),trycatch(updatestaff));


// show Advisor and advisor
router.get('/advisor',authenticateToken,trycatch(viewAdvisor));
router.get('/reviewer',authenticateToken,trycatch(viewReviewer));



// delete staffs 

router.delete('/delete/:staffId',authenticateToken,(deletestaff));




// admin side search  box
router.get('/search',authenticateToken, trycatch(searchStaff));

//payment for reviewer
router.post('/payment/:paymentid',trycatch(payment))
router.post('/verifypayment',trycatch(verifyPayment))


// for the Group meetings  email
router.post('/meetings',authenticateToken,trycatch(adminMeetings));

// get all staffs 
router.get('/staffs',authenticateToken,trycatch(getstaffs));

router.post('/stack/:adminid',authenticateToken,trycatch(add_stack));
router.delete('/stack/:adminid',authenticateToken,trycatch(delete_stack));

router.post('/batch/:adminid',authenticateToken,trycatch(add_batche));
router.delete('/batch/:adminid',authenticateToken,trycatch(delete_batch));


export default router;