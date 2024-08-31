import mongoose from "mongoose";
import { Advisor } from "../models/staff.js";
import { Student } from "../models/student.js";

export const addstudent = async (req, res) => {
  const { advisorId } = req.params;

  const value = req.body;

  if (!value) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const advisor = await Advisor.findById(advisorId);
  if (!advisor) {
    return res.status(404).json({ message: "Advisor not found" });
  }

  const existingStudent = await Student.findOne({
    email: value.email,
    phone: value.phone,
  });
  if (existingStudent) {
    return res
      .status(400)
      .json({ message: "A student with this email or phone already exists" });
  }

  const newStudent = new Student({
    name: value.name,
    email: value.email,
    phone: value.phone,
    batch: value.batch,
    stack: value.stack,
    week: value.week,
    advisor: advisorId,
  });

  // Save the new student to the database
  const savedStudent = await newStudent.save();

  advisor.students.push(savedStudent._id);
  await advisor.save();

  res.status(200).json({ message: "Student added successfully", savedStudent });
};


export const getstudents = async (req,res)=>{
  const {advisorId} = req.params;

  if (!advisorId || !mongoose.Types.ObjectId.isValid(advisorId)) {
    return res.status(400).json({ message: "Invalid Advisor ID" });
  }

  const advisor = await Advisor.findById(advisorId).populate({
    path: 'students',
    match: { is_deleted: false } 
  });


    if (!advisor) {
      return res.status(404).json({ message: "Advisor not found" });
    }

    res.status(200).json(advisor.students);
}




export const update_student = async (req,res)=>{

  const { advisorId, studentId } = req.params;
  const updateData = req.body; // Data to update, sent in the request body

  // Validate advisorId
  if (!advisorId || !mongoose.Types.ObjectId.isValid(advisorId)) {
    return res.status(400).json({ message: "Invalid Advisor ID" });
  }

  // Validate studentId
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid Student ID" });
  }

  const advisor = await Advisor.findById(advisorId).populate('students');
  if (!advisor) {
    return res.status(404).json({ message: 'Advisor not found' });
  }

  // Find the student within the advisor's list of students
  const student = advisor.students.find(student => student._id.toString() === studentId);
  if (!student) {
    return res.status(404).json({ message: 'Student not found in advisor\'s list' });
  }

  // Update the student details
  Object.assign(student, updateData);

  // Save the updated student
  await student.save();

  // Respond with the updated student
  res.status(200).json({ message: 'Student updated successfully', student });
}



export const remove_student = async (req,res)=>{

  const {advisorId, studentId}=req.params

  if (!advisorId || !mongoose.Types.ObjectId.isValid(advisorId)) {
    return res.status(400).json({ message: "Invalid Advisor ID" });
  }

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid Student ID" });
  }


      const advisor = await Advisor.findById(advisorId).populate('students');
      if (!advisor) {
        return res.status(404).json({ message: 'Advisor not found' });
      }
  

      const student = advisor.students.find(student => student._id.toString() === studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found in advisor\'s list' });
      }
  

      student.is_deleted = true;
      await student.save();
  
 
      res.status(200).json({ message: 'Student as deleted successfully' });

}