import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: function () {
      return this.__t !== 'Employee';
    },
  },
  phone: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['advisor', 'reviewer', 'employee'],
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

// Advisor schema
const AdvisorSchema = new mongoose.Schema({
  batch: {
    type: [String],
    default: [], 
  },
});

// Reviewer schema
const ReviewerSchema = new mongoose.Schema({
  stack: {
    type: [String],
    default: [],
  },
  count: {
    type: Number,
    default: 0,
  },
  hire: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: Boolean,
    default: false,
  },
});

// Employee schema
const EmployeeSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true,
  },
});

// Create the base Staff model
const Staff = mongoose.model('Staff', StaffSchema);

// Create discriminators
const Reviewer = Staff.discriminator('Reviewer', ReviewerSchema);
const Advisor = Staff.discriminator('Advisor', AdvisorSchema);
const Employee = Staff.discriminator('Employee', EmployeeSchema);

export { Staff, Reviewer, Advisor, Employee };
