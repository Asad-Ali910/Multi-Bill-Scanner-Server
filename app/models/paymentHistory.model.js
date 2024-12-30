import mongoose, { Schema } from "mongoose";

// Payment History Schema
const paymentHistorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    paymentDate: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Verify Payment Method
paymentHistorySchema.methods.verifyPayment = function () {
  this.verified = true;
  return this.save();
};

// Payment History Model
const PaymentHistory = mongoose.model("PaymentHistory", paymentHistorySchema);
export default PaymentHistory;
