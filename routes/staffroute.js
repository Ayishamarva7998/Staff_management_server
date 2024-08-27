"use strict";
import express from 'express';
import { trycatch } from '../middleware/trycatch.js';
import { acceptBooking, allBookings, booking, getbookings, reviewcount, totalreviews } from '../controllers/booking_controller.js';
import { createtimeslot, deletetimeslot, getreviewertimeslots, gettimeslot, updatetimeslot } from '../controllers/timeslot_contrller.js';
import { authenticateToken } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createTimeslotSchema, updateTimeslotSchema } from '../validation/timeslot_validation.js';
import { advisorInbox, readInbox } from '../controllers/staff_controller.js';

const router = express.Router();

// Time slote Routes 

router.get('/timeslots',authenticateToken,trycatch(gettimeslot));
router.get('/reviewer/:id/timeslots',authenticateToken, trycatch(getreviewertimeslots));
router.post('/createtimeslot',authenticateToken,validate(createTimeslotSchema), trycatch(createtimeslot));
router.put('/updatetimeslot/:id',authenticateToken,validate(updateTimeslotSchema), trycatch(updatetimeslot));
router.delete('/deletetimeslot/:id',authenticateToken, trycatch(deletetimeslot));

// Advisor Booking Routes

router.post('/booking',authenticateToken,trycatch(booking));
router.get('/reviewer/:id/bookings',authenticateToken,trycatch(getbookings));
router.post(`/acceptBooking/:id`,authenticateToken,trycatch(acceptBooking));
// inbox
router.get('/inbox/:id',trycatch(advisorInbox));
router.post('/inbox/view/:id',trycatch(readInbox));

// Reviewer Booking Routes
router.get('/allbooking/:id',trycatch(allBookings));

router.post('/reviewcount/:id',authenticateToken,trycatch(reviewcount));
router.get('/totalreviews/:id',trycatch(totalreviews));
export default router;