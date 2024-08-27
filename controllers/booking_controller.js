"use strict";
import mongoose from "mongoose";
import Booking from "../models/booking.js";
import { Advisor, Reviewer } from "../models/staff.js";
import Timeslot from "../models/timeslot.js";
import Notification from "../models/notification.js";

export const booking = async (req, res) => {
  const { advisorId, timeslotId, reviewerId, email, batch, stack, week, comments } = req.body;

  if (!advisorId || !timeslotId || !reviewerId || !email || !batch || !stack || !week) {
    return res.status(400).json({ message: 'Missing required fields!' });
  }

  const timeslot = await Timeslot.findById(timeslotId).populate({
    path: 'reviewer',
    select: 'email stack _id'
  }).exec();     
    
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

  // Mark the timeslot as unavailable
  
  // Step 3: Send Notification to the Reviewer
  const notification = new Notification({
    recipient: reviewerId,  // The reviewer who is booked
    sender: advisorId,      // The advisor who made the booking
    type: 'info',           // You can adjust the type as needed (e.g., 'info', 'success')
    message: `You have a new booking with ${email}  booked by  ${advisor.name} for  the batch ${batch} of  ${week} at ${timeslot.time}.`,
    data: {
      bookingId: booking._id,
      timeslot: timeslotId,
      email,
      batch,
      stack,
      week,
    },
    targetGroup: 'individual',
  });
  
  await notification.save();
  
  timeslot.available = false;
  await timeslot.save();
  return res.status(201).json({ message: 'Booking successfully created', booking });
};




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
  const booking = await Booking.findOne({ _id: id, is_deleted: false }).populate({
    path: 'advisor  reviewer', // Assuming your Booking schema has an advisor field
    select: 'name email' // Adjust the fields as needed
});
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Update the reviewer_accepted field to true
  booking.reviewer_accepted = true;    
  booking.is_deleted= true; 

  const notification = new Notification({
    recipient: booking.advisor._id,  // The reviewer who is booked
    sender: booking.reviewer._id,      // The advisor who made the booking
    type: 'info',           // You can adjust the type as needed (e.g., 'info', 'success')
    message: ` booking accepted by ${booking.reviewer.name} for ${booking.email}  the batch ${booking.batch} of  ${booking.week} at .`,
    data: {
      bookingId: booking._id,

    },
    targetGroup: 'individual',
  });
  
  await notification.save();
  await booking.save();

  res.status(200).json(booking);
};

export const allBookings = async (req, res) => {
const {id}=req.params
  const booking = await Booking.find({ advisor:id}).populate({
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

    const notification = new Notification({
      recipient:  reviewerId,// The reviewer who is booked
      sender: bookings.advisor_id,       // The advisor who made the booking
      type: 'info',           // You can adjust the type as needed (e.g., 'info', 'success')
      message: ` review added Total Review : ${reviewer.count}`,
      data: {
        bookingId: bookings._id,
  
      },
      targetGroup: 'individual',
    });
    
    await notification.save();

    res.status(200).json({ message: 'Review count updated successfully', reviewer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




export const totalreviews = async (req, res) => {

  const { id } = req.params;

  try {
    // Find bookings associated with the reviewer
    const totalreviews = await Booking.find({ reviewer: id, is_deleted: true, reviewer_accepted: true ,advisor_accepted : true}).populate({
      path: 'timeslot',
      select: ' date time description '
    }).populate({
      path: 'advisor', // Assuming your Booking schema has an advisor field
      select: 'name ' // Adjust the fields as needed
  });
  ;

    if (!totalreviews || totalreviews.length === 0) {
      return res.status(200).json({ message: 'No bookings found for the reviewer' });
    }

    res.status(200).json(totalreviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
