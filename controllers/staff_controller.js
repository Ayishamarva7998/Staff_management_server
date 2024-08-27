"use strict";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Staff, Reviewer, Advisor } from "../models/staff.js";
import { loginTemplate } from "../templates/login_invitation_templates.js";
import transporter from "../config/mailer.js";
import Notification from "../models/notification.js";

dotenv.config();

export const staffsadd = async (req, res) => {
  const value = req.body;
  
  if (!value) {
    return res.status(404).json({ message: "Values not found" });
  }

  if (
    !value.role ||
    !["reviewer", "advisor"].includes(value.role.toLowerCase())
  ) {
    return res
      .status(400)
      .json({ message: "Invalid role. Must be 'advisor' or 'reviewer'." });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(value.password, salt);

  // Check if the email or phone already exists
  const existingStaff = await Staff.findOne({
    $or: [{ email: value.email }, { phone: value.phone }],
  });
  if (existingStaff) {
    return res
      .status(400)
      .json({ message: "Email or phone number already exists!" });
  }

  // Create staff based on the position
  let staff;
  if (value.role === "reviewer") {
    staff = new Reviewer({
      name: value.name,
      phone: value.phone,
      email: value.email,
      role: value.role,
      password: hashedPassword,
      stack: value.stacks,
      hire: value.hire,
      count: value.count,
    });
  } else if (value.role === "advisor") {
    staff = new Advisor({
      name: value.name,
      phone: value.phone,
      email: value.email,
      role: value.role,
      password: hashedPassword,
      batch: value.batches,
    });
  }

  // Save the staff
  await staff.save();

  // Send the email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: value.email,
    subject: "Welcome to the team!",
    html: loginTemplate(value.name, value.role, value.email, value.password),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // console.error('Error sending email:', error);
      return res.status(500).json({ message: "Error sending email", error });
    } else {
      // console.log('Email sent:', info.response);
      return res.status(200).json({ message: "Staff created successfully" });
    }
  });
};

// Show Advisor in admin side
export const viewAdvisor = async (req, res) => {
  const advisors = await Advisor.find({ is_deleted: false });

  if (!advisors) {
    return res.status(404).json({ message: "No advisors found" });
  }

  res.status(200).json(advisors);
};

// Show advisors in admin side
export const viewReviewer = async (req, res) => {
  const reviewer = await Reviewer.find({ is_deleted: false });
  if (!reviewer) {
    return res.status(404).json({ message: "No reviewer found" });
  }
  res.status(200).json(reviewer);
};

// Delete Advisor in admin side
export const deletestaff = async (req, res) => {
  const { staffId } = req.params;

  const deletedStaff = await Staff.findById(staffId);
  if (!deletedStaff) {
    return res.status(404).json({ message: "Staff not found" });
  }
  deletedStaff.is_deleted = true;
  await deletedStaff.save();

  res.status(200).json({ message: "Staff deleted successfully" });
};

// search box for admin side for finding mentoe and advisor
export const searchStaff = async (req, res) => {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ message: "Search term is required" });
  }

  const regex = new RegExp(term, "i");

  // Search in both name and role fields across all staff documents
  const results = await Staff.find({
    $or: [{ name: { $regex: regex } }, { role: { $regex: regex } }],
  }).exec();

  // Return the search results
  res.status(200).json(results);
};

export const updatestaff = async (req, res) => {
  const { staffid } = req.params;
  const updateData = req.body;

  let staff = await Staff.findById(staffid);
  if (!staff) {
    return res.status(404).json({ message: "Staff member not found" });
  } 

  if (staff.__t === "Reviewer") {
    staff = await Reviewer.findByIdAndUpdate(staffid, updateData, {
      new: true,
    });
  } else if (staff.__t === "Advisor") {
    staff = await Advisor.findByIdAndUpdate(staffid, updateData, { new: true });
  } else {
    return res.status(400).json({ message: "Staff role not recognized" });
  }

  if (!staff) {
    return res.status(404).json({ message: "Failed to update staff member" });
  }
   
  res.status(200).json({ message: "Staff updated successfully" });
};

export const getstaffs = async (req, res) => {
  const all_staff = await Staff.find() ;

    if (all_staff.length > 0) {
      return res.status(200).json({ staffs: all_staff });
    }
    if (all_staff.length === 0) {
      return res.status(200).json({ staffs: [] });
    }

    res.status(404).json({ message: "No staff found", staffs: [] });

};


export const advisorInbox = async (req, res) => {
  try {
    const {id}= req.params;
    // Assuming you have only one admin document
    
  
    
    
    const notifications = await Notification.find({recipient:id, is_deleted: false }).populate({
      path: 'sender',
      select: 'name '
    })
    // console.log(notifications);

    res.status(200).json({ message: "Notifications retrieved successfully", notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const readInbox = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is provided
    if (!id) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    // Validate ObjectId format
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid Recipient ID" });
    // }

    // Mark notifications as read for the specified recipient
    const notifications = await Notification.updateMany(
      { recipient: id },
      { status: "read" }
    );

    res.status(200).json({ message: "Notifications updated successfully", notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
