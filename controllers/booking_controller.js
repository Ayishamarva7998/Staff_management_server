"use strict";
import mongoose from "mongoose";
import Booking from "../models/booking.js";
import { Advisor, Reviewer } from "../models/staff.js";
import Timeslot from "../models/timeslot.js";
import { Student } from "../models/student.js";

export const create_booking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { advisorId, timeslotId, studentId } = req.params;

    // Validate IDs
    if (!advisorId || !mongoose.Types.ObjectId.isValid(advisorId) ||
        !timeslotId || !mongoose.Types.ObjectId.isValid(timeslotId) ||
        !studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid IDs' });
    }

    // Fetch entities
    const [advisor, student, timeslot] = await Promise.all([
      Advisor.findById(advisorId).session(session),
      Student.findById(studentId).session(session),
      Timeslot.findById(timeslotId).session(session)
    ]);

    // Check if all entities are found
    if (!advisor || !student || !timeslot) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Advisor, Student, or Timeslot not found' });
    }

    const studentAssociated = advisor.students.find(student => student._id.toString() === studentId);
    if (!studentAssociated) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'This student is not this advisor\'s student' });
    }

    if (!timeslot.available) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Timeslot is not available' });
    }

    // Check if the timeslot is already booked
    const existingBooking = await Booking.findOne({ timeslot: timeslotId, is_booked: true }).session(session);
    if (existingBooking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Timeslot is already booked' });
    }

    // Extract the reviewer from the timeslot
    const reviewerId = timeslot.reviewer;
    if (!reviewerId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Timeslot does not have an associated reviewer' });
    }

    // Fetch the reviewer
    const reviewer = await Reviewer.findById(reviewerId).session(session);
    if (!reviewer || !reviewer.is_active) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Reviewer is not available' });
    }

    // Create a new booking
    const newBooking = new Booking({
      timeslot: timeslotId,
      advisor: advisorId,
      student: studentId,
      reviewer: reviewerId,
      is_booked: true,
      reviewer_accepted: false,
      advisor_accepted: false,
      is_active: true,
      is_deleted: false
    });

    // Save the booking
    await newBooking.save({ session });

    // Update the timeslot to mark it as unavailable
    await Timeslot.findByIdAndUpdate(timeslotId, { available: false }, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: 'Booking successfully' });

  } catch (error) {

    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
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
