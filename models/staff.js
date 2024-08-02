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
  position: {
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
  batches:  { type: String  // Adjust this to the type you need for batches
}
});

// Define the Mentor schema extending the base schema
const MentorSchema = new mongoose.Schema({
  stack: {
    type: String,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  details: {
    type: String,
  },
});

// Create the base Staff model
const Staff = mongoose.model('Staff', StaffSchema);

// Create discriminators
const Advisor = Staff.discriminator('Advisor', AdvisorSchema);
const Mentor = Staff.discriminator('Mentor', MentorSchema);

export { Staff, Advisor, Mentor };
