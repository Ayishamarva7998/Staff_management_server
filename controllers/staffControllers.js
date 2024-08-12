import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { Staff, Reviewer,Advisor } from '../models/staff.js';

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

    console.log(email, name, phone, role, stack, batch, password ,hire,count,'ddd');
    

    // Ensure role is valid
    if (!role || !['reviewer', 'advisor'].includes(role)) {
      console.log(role);
      
        return res.status(400).json({ message: "Invalid role. Must be 'advisor' or 'Advisor'." });
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
    } else if (role === 'advisor') {
        staff = new Advisor({
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






// Show Advisor in admin side
export const viewAdvisor = async (req, res) => {
  try {
    const advisors = await Advisor.find();

    if (advisors.length === 0) {
      return res.status(404).json({ message: 'No advisors found' });
    }

    res.status(200).json(advisors);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving advisors", error });
  }
};

// Show advisors in admin side
export const viewReviewer = async (req, res) => {
  try {
    const reviewer = await Reviewer.find();

    if (!reviewer) {
      return res.status(404).json({ message: 'No reviewer found' });
    }

    res.status(200).json(reviewer);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving reviewer", error });
  }
};

// Delete Advisor in admin side
export const deleteAdvisor = async (req, res) => {
  const { advisorId } = req.params;

  try {
    const deletedAdvisor = await Advisor.findByIdAndDelete(advisorId);

    if (!deletedAdvisor) {
      return res.status(404).json({ message: "Advisor not found" });
    }

    res.status(200).json({ message: "Advisor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting advisor", error });
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
               

//  edit sttafs or  update
export const updatestaff = async (req, res) => {
  const { staffid } = req.params;
  const { email, name, phone, role, stack, batch, password, hire, count } = req.body;

  try {
      // Find the staff member by ID
      let staff = await Staff.findById(staffid);
      if (!staff) {
          return res.status(404).json({ message: "Staff member not found" });
      }

      // Update fields if they exist in the request body
      if (email) staff.email = email;
      if (name) staff.name = name;
      if (phone) staff.phone = phone;
      if (role) {
          if (!['reviewer', 'advisor'].includes(role)) {
              return res.status(400).json({ message: "Invalid role. Must be 'advisor' or 'advisor'." });
          }
          staff.role = role;
      }
      if (stack && role === 'reviewer') staff.stack = stack;
      if (batch && role === 'advisor') staff.batch = batch;
      if (password) {
          const salt = await bcrypt.genSalt(10);
          staff.password = await bcrypt.hash(password, salt);
      }
      if (hire && role === 'reviewer') staff.hire = hire;
      if (count && role === 'reviewer') staff.count = count;

      // Save the updated staff member
      await staff.save();
      return res.status(200).json({ message: "Staff member updated successfully" });
  } catch (error) {
      return res.status(500).json({ message: "Error updating staff member", error: error.message });
  }
};


export const getstaffs = async(req,res)=>{
  const allStaff = await Staff.find();
  if (!allStaff.length) {
     return res.status(404).json({ message: 'No staff found' });
  }
  res.json({ staffs: allStaff });
}