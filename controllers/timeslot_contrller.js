"use strict";
import mongoose from "mongoose";
import Timeslot from "../models/timeslot.js";


export const gettimeslot = async (req, res) => {
  const timeslots = await Timeslot.find({available: true} )
  .populate({
    path: 'reviewer',
    select: 'email stack _id'
  })
  .exec();

if (!timeslots || timeslots.length === 0) {
  return res.status(200).json([]);
}

const response = timeslots.map(timeslot => ({
  _id: timeslot._id,
  date: timeslot.date,
  time: timeslot.time,
  available: timeslot.available,
  description: timeslot.description,
  is_active: timeslot.is_active,
  is_deleted: timeslot.is_deleted,
  created_at: timeslot.created_at,
  updated_at: timeslot.updated_at,
  reviewer: timeslot.reviewer ? {
    email: timeslot.reviewer.email,
    stack: timeslot.reviewer.stack,
    _id:timeslot.reviewer._id,
  } : null 
}));

res.status(200).json(response);
};

export const createtimeslot = async (req,res)=>{
  const { date, time, reviewer, description } = req.body;

  if (!date || !time || !description || !reviewer) {
    return res.status(400).json({ message: 'Required fields are missing.' });
  }

    const newtimeslot= new Timeslot ({ date, time, reviewer, description });
    await newtimeslot.save();
    res.status(201).json({message:'Add in timeslot'});
}

export const updatetimeslot = async (req,res)=>{
    const {id}=req.params;   
    const {date,time,description}=req.body;
    const updatedtimeslot = await Timeslot.findByIdAndUpdate(
        id,
        { date, time,description },
        { new: true }
      );

      if(!updatedtimeslot){
        return res.status(404).json({message:'Time slot not found'});
      }
      res.status(201).json({message:'Time slot updated'});
}

export const deletetimeslot = async (req,res)=>{
    const {id}=req.params;
   
    const deletetimeslot =await Timeslot.findByIdAndDelete(id);
    if(!deletetimeslot){
        return res.status(200).json([]);
    }
    res.status(200).json({message:'Time slot deleted'});
}


export const getreviewertimeslots = async (req,res)=>{
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid reviewer ID' });
  }

  const timeslots = await Timeslot.find({ reviewer:id, is_deleted: false });

  if (timeslots.length === 0) {
    return res.status(200).json([]);
  }

  return res.status(200).json(timeslots);
}