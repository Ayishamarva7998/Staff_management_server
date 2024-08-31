import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    stack: {
      type: String,
      required: true,
    },
    week: {
      type: String,
      required: true,
    },
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Advisor',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  });

  const Student = mongoose.model('Student', StudentSchema);

  export {Student}