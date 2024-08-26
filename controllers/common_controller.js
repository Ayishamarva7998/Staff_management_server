import Admin from "../models/Admin.js";
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