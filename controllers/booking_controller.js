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


export const acceptBooking = async (req, res) => {
  const { id } = req.params; // Assuming id is the booking ID

  // Check if the booking ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid booking ID' });
  }

  // Find the specific booking by its ID
  const booking = await Booking.findOne({ _id: id, is_deleted: false });

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Update the reviewer_accepted field to true
  booking.reviewer_accepted = true;    
  booking.is_deleted= true;    

  await booking.save();

  res.status(200).json(booking);
};

export const allBookings = async (req, res) => {

  const booking = await Booking.find().populate({
    path: 'timeslot',
    select: ' date time description '
  }).populate({
    path: 'reviewer', // Assuming your Booking schema has an advisor field
    select: 'name email paymentStatus' // Adjust the fields as needed
});

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  res.status(200).json(booking);
};

export const reviewcount = async (req, res) => {
  const { id } = req.params;
  // console.log(id, "review count");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid reviewer ID' });
  }

  try {
    // Find bookings associated with the reviewer
    const bookings = await Booking.find({ _id: id, is_deleted: true, reviewer_accepted: true });

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ message: 'No bookings found for the reviewer' });
    }

    // Extract the reviewer ID from the first booking
    const reviewerId = bookings[0].reviewer;
  // console.log(reviewerId,"reviwidddd");

    // Iterate over each booking and set advisor_accepted to true
    for (let booking of bookings) {
      booking.advisor_accepted = true;
      await booking.save(); // Save each booking document individually
    }

    // console.log(bookings, "dummy");

    // Find the reviewer and update the count
    const reviewer = await Reviewer.findById(reviewerId);
    if (!reviewer) {
      return res.status(404).json({ message: 'Reviewer not found' });
    }

    reviewer.count += 1;

    // Save the updated reviewer document
    await reviewer.save();

    res.status(200).json({ message: 'Review count updated successfully', reviewer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
