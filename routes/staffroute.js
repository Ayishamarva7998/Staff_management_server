"use strict";
import express from 'express';
import { trycatch } from '../middleware/trycatch.js';
import { acceptBooking, allBookings, booking, getbookings, reviewcount } from '../controllers/booking_controller.js';
import { createtimeslot, deletetimeslot, getreviewertimeslots, gettimeslot, updatetimeslot } from '../controllers/timeslot_contrller.js';
import { authenticateToken } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createTimeslotSchema, updateTimeslotSchema } from '../validation/timeslot_validation.js';

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
// Reviewer Booking Routes
router.get('/allbooking',authenticateToken,trycatch(allBookings));

router.post('/reviewcount/:id',authenticateToken,trycatch(reviewcount));
export default router;