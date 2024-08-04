import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { Staff, Reviewer, Mentor } from '../models/staff.js';

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mufeedmusthafanm@gmail.com',
    pass: 'qxkv bkbs kgip pxok'
  }
});
export const staffsadd = async (req, res) => {
    const { email, name, phone, role, stack, batch, password ,hire,count} = req.body;

    // Ensure role is valid
    if (!role || !['reviewer', 'mentor'].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'advisor' or 'mentor'." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if the email or phone already exists
    const existingStaff = await Staff.findOne({ $or: [{ email }, { phone }] });
    if (existingStaff) {
        return res.status(400).json({ message: "Staff member with this email or phone number already exists" });
    }

    let staff;

    // Create staff based on the position
    if (role === 'reviewer') {
        staff = new Reviewer({
            name,
            phone,
            email,
            role,
            password: hashedPassword,
            stack,
            hire,
            count
        });
    } else if (role === 'mentor') {
        staff = new Mentor({
            name,
            phone,
            email,
            role,
            password: hashedPassword,
            batch 
        });
    }

    // Save the staff
    await staff.save();

    // Send the email
    const mailOptions = {
        from: 'mufeedmusthafanm@gmail.com',
        to: email,
        subject: 'Welcome to the team!',
        text: `Hello ${name},\n\nWelcome to the team as our new ${role}. We're excited to have you on board!\n\nWe have created your profile with the following details:\nName: ${name}\nEmail: ${email}\nPassword: ${password}\n\nPlease keep this information secure and change your password after logging in for the first time.\n\nBest regards,\nYour Company`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    return res.status(200).json({ message: "Staff created successfully" });
};






// Show mentors in admin side
export const viewMentor = async (req, res) => {
  try {
    const mentors = await Mentor.find();

    if (mentors.length === 0) {
      return res.status(404).json({ message: 'No mentors found' });
    }

    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving mentors", error });
  }
};

// Show advisors in admin side
export const viewReviewer = async (req, res) => {
  try {
    const reviewer = await Reviewer.find();

    if (reviewer.length === 0) {
      return res.status(404).json({ message: 'No reviewer found' });
    }

    res.status(200).json(reviewer);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reviewer", error });
  }
};

// Delete mentor in admin side
export const deleteMentor = async (req, res) => {
  const { mentorId } = req.params;

  try {
    const deletedMentor = await Mentor.findByIdAndDelete(mentorId);

    if (!deletedMentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.status(200).json({ message: "Mentor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting mentor", error });
  }
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
  
      console.log('Search results:', results); 
  
      // Return the search results
      res.status(200).json(results);
    
   
  };
               

 