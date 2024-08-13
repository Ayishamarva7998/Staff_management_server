"use strict";
import mongoose from "mongoose";
import Booking from "../models/booking.js";
import { Advisor, Reviewer } from "../models/staff.js";
import Timeslot from "../models/timeslot.js";

export const booking = async (req,res)=>{
  const { advisorId, timeslotId, reviewerId, email, batch, stack, week, comments } = req.body;

  if (!advisorId || !timeslotId || !reviewerId || !email || !batch || !stack || !week) {
    return res.status(400).json({ message: 'Missing required fields!' });
  }
    const timeslot = await Timeslot.findById(timeslotId).populate({
    path: 'reviewer',
    select: 'email stack _id'
  })
  .exec();     
    
    if (!timeslot) {
      return res.status(404).json({ message: 'Timeslot not found!' });
    }

    if (!timeslot.available) {
        return res.status(400).json({ message: 'Timeslot is not available!' });
      }

      const reviewer = await Reviewer.findById(reviewerId);
      if (!reviewer) {
        return res.status(404).json({ message: 'Reviewer not found!' });
      }

      const advisor = await Advisor.findById(advisorId);
    if (!advisor) {
      return res.status(404).json({ message: 'Advisor not found!' });
    }

    const booking = new Booking({
      timeslot: timeslotId,
      reviewer: reviewerId,
      advisor: advisorId,
      email,
      batch,
      stack,
      week,
      comments,
      is_booked: true, 
    });

      // Save the booking
      await booking.save();
  
      timeslot.available = false;
      await timeslot.save();
  
      return res.status(201).json({ message: 'Booking successfully', booking });
  }



  export const getbookings = async (req,res)=>{
      
    const {id}=req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid reviewer ID' });
    }

    const bookings= await Booking.find({ reviewer:id, is_deleted: false }).populate({
      path: 'timeslot',
      select: ' date time description '
    }).populate({
      path: 'advisor', // Assuming your Booking schema has an advisor field
      select: 'name email' // Adjust the fields as needed
  })
    .exec();;
  


    if(!bookings){
      return res.status(200).json([]);
    }
    
    res.status(200).json(bookings);
}