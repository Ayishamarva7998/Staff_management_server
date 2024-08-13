"use strict";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Staff, Reviewer, Advisor } from '../models/staff.js';
import { loginTemplate } from '../templates/login_invitation_templates.js';

dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const staffsadd = async (req, res) => {

      const value=req.body;
      if(!value){
        return res.status(404).json({message:'Values not found'});
      }


   // Ensure role is valid
   if (!value.role || !['reviewer', 'advisor'].includes(value.role.toLowerCase())) {
    return res.status(400).json({ message: "Invalid role. Must be 'advisor' or 'reviewer'." });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(value.password, salt);

  // Check if the email or phone already exists
  const existingStaff = await Staff.findOne({ $or: [{ email:value.email }, { phone:value.phone }] });
  if (existingStaff) {
    return res.status(400).json({ message: "Email or phone number already exists!" });
  }

  // Create staff based on the position
  let staff;
  if (value.role === 'reviewer') {
    staff = new Reviewer({
      name:value.name,
      phone:value.phone,
      email:value.email,
      role:value.role,
      password: hashedPassword,
      stack:value.stack,
      hire:value.hire,
      count:value.count
    });
  } else if (value.role === 'advisor') {
    staff = new Advisor({
      name:value.name,
      phone:value.phone,
      email:value.email,
      role:value.role,
      password: hashedPassword,
      batch:value.batch 
    });
  }

  // Save the staff
  await staff.save();

  // Send the email
  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: value.email,
    subject: 'Welcome to the team!',
    html: loginTemplate(value.name,value.role, value.email, value.password)
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending email', error });
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
    return res.status(404).json({ message: 'No advisors found' });
  }

  res.status(200).json(advisors);
};

// Show advisors in admin side
export const viewReviewer = async (req, res) => {
  const reviewer = await Reviewer.find({ is_deleted: false });
  if (!reviewer) {
    return res.status(404).json({ message: 'No reviewer found' });
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
        return res.status(400).json({ message: 'Search term is required' });
      }
  
      const regex = new RegExp(term, 'i');
  
      // Search in both name and role fields across all staff documents
      const results = await Staff.find({
        $or: [
          { name: { $regex: regex } },
          { role: { $regex: regex } }
        ]
      }).exec();
  
      // Return the search results
      res.status(200).json(results);    
   
  };
               

// Update or edit staff
export const updatestaff = async (req, res) => {
  const { staffid } = req.params;
  const { email, name, phone, role, stack, batch, hire, count, removeBatch } = req.body;

  let staff = await Staff.findById(staffid);
  if (!staff) {
    return res.status(404).json({ message: "Staff not found" });
  }

  // Update fields if they exist in the request body
  if (email) staff.email = email;
  if (name) staff.name = name;
  if (phone) staff.phone = phone;
  if (role) {
    if (!['reviewer', 'advisor'].includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Invalid role. Must be 'reviewer' or 'advisor'." });
    }
    staff.role = role.toLowerCase();
  }
  if (stack && staff.role === 'reviewer') staff.stack = stack;

  // Handle batch addition or removal if the role is 'advisor'
  if (staff.role === 'advisor') {
    if (batch) {
      // Ensure the batch field is an array
      if (!Array.isArray(staff.batch)) {
        staff.batch = []; // Initialize as an empty array if it's not already an array
      }

      // Add new batches to the existing batch array
      if (Array.isArray(batch)) {
        // Use Set to avoid duplicate entries
        staff.batch = [...new Set([...staff.batch, ...batch])];
      } else if (typeof batch === 'string') {
        if (!staff.batch.includes(batch)) {
          staff.batch.push(batch); // Add single batch to the array if it's not already included
        }
      }
    }

    // Remove batches from the array if `removeBatch` is provided
    if (removeBatch) {
      if (Array.isArray(removeBatch)) {
        // Ensure removeBatch is an array
        staff.batch = staff.batch.filter(b => !removeBatch.includes(b));
      } else if (typeof removeBatch === 'string') {
        staff.batch = staff.batch.filter(b => b !== removeBatch);
      }
    }
  }

  if (hire && staff.role === 'reviewer') staff.hire = hire;
  if (count && staff.role === 'reviewer') staff.count = count;

  // Save the updated staff member
  await staff.save();
  return res.status(200).json({ message: "Staff updated successfully" });
};


export const getstaffs = async(req,res)=>{
  const allStaff = await Staff.find();
  if (!allStaff.length) {
     return res.status(404).json({ message: 'No staff found' });
  }
  res.json({ staffs: allStaff });
}