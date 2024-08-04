import { Staff } from '../models/staff.js';
import nodemailer from 'nodemailer';

export const adminMeetings = async (req, res) => {
  const { date, time, description } = req.body;

  try {
    // Step 1: Retrieve all staff emails from the database
    const staffMembers = await Staff.find({}, 'email'); // Get only the email field from all staff

    if (!staffMembers || staffMembers.length === 0) {
      return res.status(404).send('No staff members found');
    }

    const emails = staffMembers.map(staff => staff.email);
    console.log(emails)
    // // Step 2: Set up Nodemailer
    let transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: 'mufeedmusthafanm@gmail.com',
        pass: 'qxkv bkbs kgip pxok'
      },
    });

    // Step 3: Send the email to all retrieved emails
    let mailOptions = {
      from: 'your-email@example.com', // sender address
      to: emails.join(','), // list of receivers
      subject: 'Meeting Information',
      text: `Meeting Details:\nDate: ${date}\nTime: ${time}\nDescription: ${description}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send('Emails sent: ' + info.response);
    });
  } catch (error) {
    res.status(500).send('Error retrieving staff members: ' + error.message);
  }
};
