"use strict";
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

export const updatePassword = async (req, res) => {
  const { adminid } = req.params;
  const { newPassword } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updatedAdmin = await Admin.findByIdAndUpdate(
    adminid,
    { password: hashedPassword },
    { new: true, runValidators: true } // Ensure we get the updated document and run validation
  );
  if (!updatedAdmin) {
    return res.status(404).json({ message: "User not found" });
  }
  return res
    .status(200)
    .json({ message: "Password update successfully", data: updatedAdmin });
};


