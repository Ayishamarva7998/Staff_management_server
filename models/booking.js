import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  timeslot: { type: mongoose.Schema.Types.ObjectId, ref: "Timeslot", required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "Reviewer", required: true },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: "Advisor", required: true },
  email: { type: String, required: true }, // Adding email here
  batch: { type: String, required: true },
  stack: { type: String, required: true },
  week: { type: String, required: true },
  is_booked: { type: Boolean, default: false },    
  reviewer_accepted: { type: Boolean, default: false },    
  advisor_accepted: { type: Boolean, default: false },    
  comments: { type: String },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
