"use strict";
import express from 'express';
import { trycatch } from '../middleware/trycatch.js';
import { acceptBooking, allBookings, create_booking, getbookings, reviewcount, totalreviews } from '../controllers/booking_controller.js';
import { createtimeslot, deletetimeslot, getreviewertimeslots, gettimeslot, updatetimeslot } from '../controllers/timeslot_contrller.js';
import { authenticateToken } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createTimeslotSchema, updateTimeslotSchema } from '../validation/timeslot_validation.js';
import { addstudent, getstudents, remove_student, update_student } from '../controllers/students_controllers.js';
import { studentValidationSchema, updateStudentValidationSchema } from '../validation/student_validation.js';

const router = express.Router();

// Time slote Routes 

router.get('/timeslots',authenticateToken,trycatch(gettimeslot));
router.get('/reviewer/:id/timeslots',authenticateToken, trycatch(getreviewertimeslots));
router.post('/createtimeslot',authenticateToken,validate(createTimeslotSchema), trycatch(createtimeslot));
router.put('/updatetimeslot/:id',authenticateToken,validate(updateTimeslotSchema), trycatch(updatetimeslot));
router.delete('/deletetimeslot/:id',authenticateToken, trycatch(deletetimeslot));

// Advisor Booking Routes

router.post('/booking/:advisorId/:studentId/:timeslotId',create_booking);
router.get('/reviewer/:id/bookings',authenticateToken,trycatch(getbookings));
router.post(`/acceptBooking/:id`,authenticateToken,trycatch(acceptBooking));
// Reviewer Booking Routes
router.get('/allbooking',authenticateToken,trycatch(allBookings));

router.post('/reviewcount/:id',authenticateToken,trycatch(reviewcount));
router.get('/totalreviews/:id',trycatch(totalreviews));



// students routes 

router.post('/student/:advisorId',authenticateToken,validate(studentValidationSchema),trycatch(addstudent));
router.get('/student/:advisorId',getstudents);
router.put('/student/:advisorId/:studentId',authenticateToken,validate(updateStudentValidationSchema),trycatch(update_student));
router.delete('/student/:advisorId/:studentId',authenticateToken,trycatch(remove_student))


export default router;