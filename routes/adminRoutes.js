"use strict";
import express from 'express';
import { trycatch } from '../middleware/trycatch.js';
import { createAdmin,updatePassword } from '../controllers/adminControllers.js';
import validate from '../middleware/validate.js';
import { adminSchema } from '../validation/adminValidation.js';
import { deleteMentor, searchStaff, staffsadd, updatestaff, viewMentor, viewReviewer } from '../controllers/staffControllers.js';
import staffValidationSchema from '../validation/staffValidation.js';
import { payment } from '../controllers/paymentControllers.js';
import { adminMeetings } from '../controllers/adminmeetingControllers.js';

const router=express.Router();

router.post('/adds',validate(adminSchema),trycatch(createAdmin));
router.put('/:adminid',trycatch(updatePassword));
//   add staffs in admin page
router.post('/staff', validate(staffValidationSchema),trycatch(staffsadd));
//  edit staffs details
router.patch('/:staffid',trycatch(updatestaff));

// show mentor and advisor
router.get('/mentor',trycatch(viewMentor));
router.get('/reviewer',trycatch(viewReviewer));



// delete  mentor and advisor

router.delete('/advisor/:mentorid',trycatch(deleteMentor));
// admin side search  box
router.get('/search', trycatch(searchStaff));

//payment for reviewer
router.post('/payment/:paymentid',trycatch(payment))


// for the Group meetings  email
router.post('/meetings',trycatch(adminMeetings))
export default router;