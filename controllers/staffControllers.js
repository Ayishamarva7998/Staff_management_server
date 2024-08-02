
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import{ Staff, Advisor, Mentor }from '../models/staff.js'
// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mufeedmusthafanm@gmail.com',
        pass: 'qxkv bkbs kgip pxok'
}
});
 
export const staffsadd = async (req, res) => {
    const { name, phone, email, position, stack, password, batch } = req.body;

    // Ensure position is valid
    if (!position || !['advisor', 'mentor'].includes(position)) {
        return res.status(400).json({ message: "Invalid position. Must be 'advisor' or 'mentor'." });
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
    if (position === 'advisor') {
        staff = new Advisor({ 
            name, 
            phone, 
            email, 
            position, 
            password: hashedPassword, 
            batches: batch  // Adjust according to your schema (array of strings or another structure)
        });
    } else if (position === 'mentor') {
        staff = new Mentor({ 
            name, 
            phone, 
            email, 
            position, 
            password: hashedPassword, 
            stack  // Adjust according to your schema
        });
    }

    // Save the staff
    await staff.save();
        // Send the email
        const mailOptions = {
            from: 'mufeedmusthafanm@gmail.com',
            to: email,
            subject: 'Welcome to the team!',
            text: `Hello ${name},\n\nWelcome to the team as our new ${position}. We're excited to have you on board!\n\nWe have created your profile with the following details:\nName: ${name}\nEmail: ${email}\nPassword: ${password}\n\nPlease keep this information secure and change your password after logging in for the first time.\n\nBest regards,\nYour Company`
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

                          // show mentor in admin side
export const viewMentor = async (req, res) => {
   
      // Query for mentors where position is 'mentor'
      const mentors = await Staff.find({ position: 'mentor'});
      
      // Check if any mentors were found
      if (mentors.length === 0) {
        return res.status(404).json({ message: 'No mentors found' });
      }
  
      // Return the list of mentors
      res.status(200).json(mentors);

  };
                    // show advisor in admin side
  export const viewAdvisor = async (req, res) => {
   
    // Query for mentors where position is 'mentor'
    const advisor = await Staff.find({ position: 'advisor'});
    
    // Check if any mentors were found
    if (advisor.length === 0) {
      return res.status(404).json({ message: 'No mentors found' });
    }

    // Return the list of mentors
    res.status(200).json(advisor);

};

//  delete  mentor in admon side

export const deleteMentor = async (req, res) => {
    const { mentorid } = req.params;

    try {
        const deletedMentor = await Staff.findByIdAndDelete(mentorid);

        if (!deletedMentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        res.status(200).json({ message: "Mentor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting mentor", error });
    }
};


