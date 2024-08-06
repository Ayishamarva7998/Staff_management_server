import { Staff } from '../models/staff.js';
import nodemailer from 'nodemailer';
import Admin from "../models/Admin.js";

export const adminMeetings = async (req, res) => {
  const { title, date, time, participants, meetingtype, description } = req.body;
  
  // Validate input
  if (!title || !date || !time || !participants || !meetingtype || !description) {
    return res.status(400).json({ message: "All fields are required" });
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

 
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meeting Invitation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background: #f4f4f4;
            }
            .container {
                width: 90%;
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background: #ffffff;
                border: 1px solid #e1e1e1;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: #0044cc; /* Deep blue for header background */
                color: #ffffff;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
            }
            .header img {
                max-width: 150px;
                margin-bottom: 10px;
                 border-radius: 50%; 
                object-fit: cover; 
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }
            .company-name {
                font-size: 18px;
                color: #e0e0e0;
                margin-top: 5px;
            }
            .details {
                padding: 20px;
                background: #f9f9f9;
                border-radius: 8px;
            }
            .details p {
                margin: 15px 0;
                font-size: 16px;
            }
            .details strong {
                color: #0044cc; /* Deep blue for strong text */
            }
            .footer {
                text-align: center;
                padding: 15px;
                background: #e1e1e1; /* Light gray for footer background */
                border-radius: 0 0 8px 8px;
            }
            .footer p {
                margin: 0;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUsj969OxAXIdz0f33l_yF02ZyMY5aLHclIA&s" alt="Bridgeon Solutions">
                <h1>Meeting Invitation</h1>
                <div class="company-name">Bridgeon Solutions</div>
            </div>
            <div class="details">
                <p><strong>Title:</strong> ${title}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Meeting Type:</strong> ${meetingtype}</p>
                <p><strong>Description:</strong> ${description}</p>
            </div>
            <div class="footer">
                <p>Looking forward to your participation.</p>
            </div>
        </div>
    </body>
    </html>
  `;


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

    // Update admin notification
    const notificationMessage = `Meeting scheduled on ${date} at ${time} with description: ${description}`;
    await Admin.updateOne({}, { notification: notificationMessage });

    res.status(200).json({ message: 'Invite sent to all participants' });
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
};
