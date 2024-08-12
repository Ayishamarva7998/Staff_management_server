import mongoose from 'mongoose';

// Base schema with common fields
const StaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  calendarId: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
  },
  programs: [{
    date: {
      type: Date,
    },
    details: {
      type: String,

    },
  }],
  notification: {
    type: String,
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

// Define the Advisor schema extending the base schema
const AdvisorSchema = new mongoose.Schema({
  batch: [{ type: String  // Adjust this to the type you need for batches
}]
});

// Define the Advisor schema extending the base schema
const ReviewerSchema = new mongoose.Schema({
  stack: {
    type: String,
  },
  count: {
    type: Number,
    default: 0,
  },
  hire: {
    type: Number,
    default: 0,
  },
  details: {
    type: String,
  },
  paymentStatus: { type: String, default: 'UNPAID' },
});

// Create the base Staff model
const Staff = mongoose.model('Staff', StaffSchema);

// Create discriminators
const Reviewer = Staff.discriminator('Reviewer', ReviewerSchema);
const Advisor = Staff.discriminator('Advisor', AdvisorSchema);

export { Staff, Reviewer, Advisor };

