import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "user" },
  isActive: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
});

export default subscription = mongoose.model(
  subscriptionSchema,
  "subscription"
);
