"use strict";
import { Staff } from '../models/staff.js';
import nodemailer from 'nodemailer';
import Admin from "../models/Admin.js";
import Notification from '../models/notification.js';
import { meetingInvitationTemplate } from '../templates/meeting_invitation_template.js';

export const adminMeetings = async (req, res) => {
  const { title, date, time, participants, meetingtype, description } = req.body;
  
  // Validate input
  if (!title || !date || !time || !participants || !meetingtype || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const staffMembers = await Staff.find({ email: { $in: participants } });

    if (staffMembers.length === 0) {
      return res.status(404).json({ message: "No participants found" });
    }

  // Ensure participants is an array of email addresses
  const emails = await participants.join(', ');
  
  if (!emails) {
    return res.status(404).json({ message: "No participants found" });
  }

  // Set up email transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Use environment variable for email
      pass: process.env.EMAIL_PASS   // Use environment variable for password
    }
  });

 
  const htmlContent = meetingInvitationTemplate({ title, date, time, meetingtype, description });


  // Email options
  let mailOptions = {
    from: process.env.EMAIL_USER,  // Use environment variable for email
    to: emails,                    // List of receivers
    subject: 'Meeting Information',
    html: htmlContent,
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    const admin = await Admin.findOne();  // Assuming you have only one admin document
 
    const adminId = admin._id;
    for (const staff of staffMembers) {
      const notificationMessage = `Meeting scheduled on ${date} at ${time} with the title "${title}". Please check your email for more details.`;
      
      const notification = new Notification({
        recipient: staff._id,  // The participant who is invited
        sender:  adminId,     // The admin who scheduled the meeting
        type: 'info',          // Notification type
        message: notificationMessage,
        data: {
          meetingId: info.messageId,  // Optional: reference to the sent email
        },
        targetGroup: 'individual',
      });

      await notification.save();
    }

    res.status(200).json({ message: 'Invite sent to all participants and notifications created' });
    // const notificationMessage = `Meeting scheduled on ${date} at ${time} with description: ${description}`;
    // await Admin.updateOne({}, { notification: notificationMessage });
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
};
