import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  timeslot: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Timeslot", 
    required: true 
  },
  reviewer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Reviewer", 
    required: true 
  },
  advisor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Advisor", 
    required: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", 
    required: true 
  },
  is_booked: { 
    type: Boolean, 
    default: false 
  },
  reviewer_accepted: { 
    type: Boolean, 
    default: false 
  },
  advisor_accepted: { 
    type: Boolean, 
    default: false 
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
  is_deleted: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
