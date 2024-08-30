import mongoose from "mongoose";

// Define a payment history schema
const paymentSchema = new mongoose.Schema(
  {
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviewer", 
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentStatus: { type: Boolean, default: 'false' },
    is_deleted: {
      type: Boolean,
      default: false,
    },

    paymentID: { type :String, required: true,}

  },
  { timestamps: true }
);
const Paymenthistory =mongoose.model("payment", paymentSchema);
export default Paymenthistory;
