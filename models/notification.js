import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'Staff', required: false }, // Reference to the recipient (optional if sending to multiple)
    sender: { type: Schema.Types.ObjectId, ref: 'Staff', required: false }, // Reference to the sender (Admin or Advisor)
    type: { type: String, enum: ['info', 'warning', 'success', 'error'], required: true }, // Type of notification
    message: { type: String, required: true }, // Notification message content
    status: { type: String, enum: ['unread', 'read'], default: 'unread' }, // Status of the notification
    data: { type: Schema.Types.Mixed, default: {} }, // Optional additional data related to the notification
    targetGroup: { type: String, enum: ['all', 'advisors', 'reviewers', 'individual'], required: true }, // Target group for the notification
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
