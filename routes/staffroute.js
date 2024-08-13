"use strict";
import express from 'express';
import { trycatch } from '../middleware/trycatch.js';
import { booking, getbookings } from '../controllers/booking_controller.js';
import { createtimeslot, deletetimeslot, getreviewertimeslots, gettimeslot, updatetimeslot } from '../controllers/timeslot_contrller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Time slote Routes 

router.get('/timeslots',authenticateToken,trycatch(gettimeslot));
router.get('/reviewer/:id/timeslots',authenticateToken, trycatch(getreviewertimeslots));
router.post('/createtimeslot',authenticateToken, trycatch(createtimeslot));
router.put('/updatetimeslot/:id',authenticateToken, trycatch(updatetimeslot));
router.delete('/deletetimeslot/:id',authenticateToken, trycatch(deletetimeslot));

// Advisor Booking Routes

router.post('/booking',authenticateToken,trycatch(booking));
router.get('/reviewer/:id/bookings',authenticateToken,trycatch(getbookings));


export default router;