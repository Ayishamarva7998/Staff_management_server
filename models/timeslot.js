import mongoose from "mongoose";

const timeslotSchema = new mongoose.Schema({
  date: {
      type: String,
      required: true,
  },
  time: {
      type: String,
      required: true,
  },
  available: {
      type: Boolean,
      required: true,
      default: true,
  },
  reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
  },
  created_at: {
      type: Date,
      default: Date.now,
  },
  description: {
    type: String,
    required: true,
},
  updated_at: {
      type: Date,
      default: Date.now,
  },
  is_active: {
      type: Boolean,
      default: true,
  },
  is_deleted: {
      type: Boolean,
      default: false,
  }
}, {
  timestamps: true,
});

const Timeslot = mongoose.model('Timeslot',timeslotSchema);
export default Timeslot;