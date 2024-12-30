import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User Schema
const userSchema = new Schema(
  {
    fullname: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    refreshToken: { type: String },
    verified: { type: Boolean, default: false },
    subscription: { type: Schema.Types.ObjectId, ref: "Subscription" },
    paymentHistory: [{ type: Schema.Types.ObjectId, ref: "PaymentHistory" }],
  },
  { timestamps: true }
);

// Hash Password Before Save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});
// Instance Method: Check Password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = async function () {
  const data = { _id: this._id };
  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
  this.refreshToken = refreshToken;
  await this.save();
  return refreshToken;
};

// check the refresh Token
userSchema.methods.isRefreshTokenCorrect = async function (Token) {
  return await bcrypt.compare(Token, this.refreshToken);
};

// User Model
const User = mongoose.model("User", userSchema);

export default User;
