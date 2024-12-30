import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { LimitExceededError } from "../utils/CustomError.js";

// OTP Schema
const otpSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true },
  expiresIn: {
    type: Date,
    default: () => Date.now() + 600000, // 10 minutes
    index: true, // TTL index will handle expiry
  },
  requests: { type: Number, default: 1, max: 3 },
});

// Hash OTP Before Saving
otpSchema.pre("save", async function (next) {
  if (!this.isModified("code")) return next();
  this.code = await bcrypt.hash(this.code, 10);
  next();
});

// OTP Validation
otpSchema.methods.isOtpCorrect = async function (otp) {
  return await bcrypt.compare(otp, this.code);
};

// Increment Requests and Check Max Limit
otpSchema.methods.incrementRequests = async function () {
  if (this.requests >= 3) {
    throw new LimitExceededError("Max OTP attempts reached.");
  }
  this.requests += 1;
  await this.save();
};

// Create OTP Model
const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
export default Otp;
