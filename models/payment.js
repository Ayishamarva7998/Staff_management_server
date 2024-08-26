import mongoose from "mongoose";

// Define a payment history schema
const paymentSchema = new mongoose.Schema(
  {
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviewer", // Assuming you have a Reviewer model
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
    // paymentStatus: {
    //   type: String,
    //   enum: ["Pending", "Completed"],
    //   default: "Pending",
    // },
  },
  { timestamps: true }
);
const Paymenthistory =mongoose.model("payment", paymentSchema);
export default Paymenthistory;
