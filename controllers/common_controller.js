import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Booking from "../models/booking.js";
import { Staff } from "../models/staff.js";
import bcrypt from "bcrypt";


export const getdatafromid = async (req,res)=>{
    const {Id} = req.params;

    const admin = await Admin.findById(Id);
    if (admin) {
        return res.status(200).json({ ...admin.toObject(), role: 'admin' });
    }

    const staff = await Staff.findById(Id);
    if (staff) {
        return res.status(200).json({ ...staff.toObject() });
    }

    return res.status(404).json({ message: "Not found" });
}



export const updatePassword = async (req, res) => {

    const { Id } = req.params;
  
    const value = req.body;

    console.log(Id,value);
    
    if (value.newPassword !== value.confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }
  

    let user = await Admin.findById(Id);
    if (!user) {
      user = await Staff.findById(Id);
      if (!user) {
        return res.status(404).json({ message: "Not found" });
      }
    }

    const isMatch = await bcrypt.compare(value.currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value.newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  };

  export const getStacks = async (req,res)=>{
    const admins = await Admin.find(); 
      const stacks = admins.flatMap(admin => admin.stacks); 
      res.json(stacks); 
  }
  
  export const getBatchs = async (req,res)=>{
    const admins = await Admin.find(); 
    const batches = admins.flatMap(admin => admin.batches); 
    res.json(batches); 
  }


  export const add_google_calendar_event  = async (req,res)=>{
    const { booking_id } = req.params;
    

    if (!mongoose.Types.ObjectId.isValid(booking_id)) {
      return res.status(400).json({ message: 'Invalid reviewer ID' });
    }
   const booking_details = await Booking.findById(booking_id);

   const bookings= await Booking.findById(booking_id).populate({
    path: 'timeslot',
    select: ' date time description '
  }).populate({
    path: 'advisor', 
    select: 'name email' 
})
  .exec();;



  if(!bookings){
    return res.status(404).json({message:'Not found the booking details'});
  }
  const {
    timeslot: { date: timeslotDate, time: timeslotTime },
    advisor,
    email,
    week,
    stack,
    batch
  } = bookings;

  // Validate timeslot details
  if (!timeslotDate || !timeslotTime) {
    return res.status(400).json({ message: 'Timeslot details are missing' });
  }

  // Format start and end times
  const startDate = new Date(`${timeslotDate}T${timeslotTime}:00`);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1); // Adding 1 hour to the start time

  // Function to format dates for Google Calendar URL
  const formatDate = (date) => date.toISOString().replace(/-|:|\.\d+/g, "");

  const eventStartDate = formatDate(startDate);
  const eventEndDate = formatDate(endDate);

  // Prepare URL components for Google Calendar
  const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const eventTitle = encodeURIComponent(`Meeting with ${email}`);
  const eventDescription = encodeURIComponent(`Example: Advisor ${advisor.email} has booked a meeting for the student (${email}). The student is in the ${batch} batch, focusing on the ${stack} stack during Week ${week}.`);
  const eventLocation = encodeURIComponent('Bridgeon Solutions');

  // Generate the Google Calendar event URL
  const eventURL = `${baseUrl}&text=${eventTitle}&dates=${eventStartDate}/${eventEndDate}&details=${eventDescription}&location=${eventLocation}&sf=true&output=xml`;

  // Respond with the booking ID, ID, and the event URL
  res.status(200).json({ booking_id, id: bookings._id, url: eventURL });

  }