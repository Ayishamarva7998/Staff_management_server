"use strict";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";

export const createAdmin = async (req, res) => {
  const value = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(value.password, salt);

  const admin = new Admin({
    username: value.username,
    stacks: value.stacks,
    batches: value.batches,
    email: value.email,
    password: hashedPassword,
  });
  await admin.save();

  return res
    .status(201)
    .json({ message: "Admin created successfully", data: admin });
};


export const add_batche = async (req, res) => {
  const { adminid } = req.params;
  const  {batches}  = req.body;   

  if (!mongoose.isValidObjectId(adminid)) {
    return res.status(400).json({ message: 'Invalid Admin ID format!' });
  }
  
  if (!batches) {
    return res.status(400).json({ message: 'Batch is required!' });
  }
  
    const admin = await Admin.findById(adminid);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found!' });
    }

    if (admin.batches.includes(batches)) {
      return res.status(200).json({ message: 'Batch already exists!' });
    }

    const result = await Admin.updateOne(
      { _id: adminid },
      { $push: { batches: batches } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'No changes made or batch already exists!' });
    }

    return res.status(200).json({ message: 'Batch added successfully!' });
  
};



export const add_stack = async (req, res) => {
  const { adminid } = req.params;
  const { stack } = req.body;

  if (!mongoose.isValidObjectId(adminid)) {
    return res.status(400).json({ message: 'Invalid Admin ID format!' });
  }

  if (!stack) {
    return res.status(400).json({ message: 'Stack is required!' });
  }

  const admin = await Admin.findById(adminid);

  if (!admin) {
    return res.status(404).json({ message: 'Admin not found!' });
  }

  const stackLowerCase = stack.toLowerCase();
  const stackUpperCase = stack.toUpperCase();
  
  const exists = admin.stacks.some(existingStack => 
    existingStack.toLowerCase() === stackLowerCase || 
    existingStack.toUpperCase() === stackUpperCase
  );

  if (exists) {
    return res.status(200).json({ message: 'Stack already exists!' });
  }

  const result = await Admin.updateOne(
    { _id: adminid },
    { $push: { stacks: stack } }
  );

  if (result.modifiedCount === 0) {
    return res.status(400).json({ message: 'No changes made or stack already exists!' });
  }

  return res.status(200).json({ message: 'Stack added successfully!' });
}


export const delete_stack = async (req,res)=>{
  const { adminid } = req.params;
  const { stack } = req.query;


  if (!mongoose.isValidObjectId(adminid)) {
    return res.status(400).json({ message: 'Invalid Admin ID format!' });
  }

  if (!stack) {
    return res.status(400).json({ message: 'Stack is required!' });
  }

  const admin = await Admin.findById(adminid);

  if (!admin) {
    return res.status(404).json({ message: 'Admin not found!' });
  }

  const stackLowerCase = stack.toLowerCase();
  const stackUpperCase = stack.toUpperCase();
  
  const exists = admin.stacks.some(existingStack => 
    existingStack.toLowerCase() === stackLowerCase || 
    existingStack.toUpperCase() === stackUpperCase
  );

  if (!exists) {
    return res.status(404).json({ message: 'Stack not found!' });
  }
  const result = await Admin.updateOne(
    { _id: adminid },
    { $pull: { stacks: stack } }
  );

  if (result.modifiedCount === 0) {
    return res.status(400).json({ message: 'No changes made or stack not found!' });
  }

  return res.status(200).json({ message: 'Stack deleted successfully!' });
}



export const delete_batch = async (req, res) => {
  const { adminid } = req.params;
  const { batch } = req.query;

  if (!mongoose.isValidObjectId(adminid)) {
    return res.status(400).json({ message: 'Invalid Admin ID format!' });
  }

  if (!batch) {
    return res.status(400).json({ message: 'Batch is required!' });
  }

  const admin = await Admin.findById(adminid);

  if (!admin) {
    return res.status(404).json({ message: 'Admin not found!' });
  }

  const batchLowerCase = batch.toLowerCase();
  const batchUpperCase = batch.toUpperCase();
  
  const exists = admin.batches.some(existingBatch => 
    existingBatch.toLowerCase() === batchLowerCase || 
    existingBatch.toUpperCase() === batchUpperCase
  );

  if (!exists) {
    return res.status(404).json({ message: 'Batch not found!' });
  }

  const result = await Admin.updateOne(
    { _id: adminid },
    { $pull: { batches: batch } }
  );

  if (result.modifiedCount === 0) {
    return res.status(400).json({ message: 'No changes made or batch not found!' });
  }

  return res.status(200).json({ message: 'Batch deleted successfully!' });
}