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

  },role: {
    type: String,
    enum: [  'advisor', 'reviewer'],
    default: 'advisor',
  },
  position: {
    type: String,
    required: true,
  },
  stack: {
    type: String,
 
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

const Staff = mongoose.model('Staff', StaffSchema);
export default  Staff