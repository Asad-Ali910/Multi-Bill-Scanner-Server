import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    devices: [{ id: { type: String }, refreshToken: { type: String } }],
    otp: { type: String },
    verified: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: function () {
        return this.verified ? undefined : 100; // 300 seconds (5 min) if not verified
      },
    },
    subscription: {
      isActive: { type: Boolean, default: false },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
    },
    paymentHistory: [
      {
        paymentDate: { type: Date, default: Date.now },
        amount: { type: Number, required: true },
        transactionId: { type: String, required: true },
        verified: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// Hashing the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Function to register the user
userSchema.statics.registerUser = async function (
  name,
  username,
  email,
  password,
  otp
) {
  try {
    const user = new this({
      name,
      username,
      email,
      password,
      otp,
    });
    await user.save();
    console.log("New User registered with TTL.");
    return user;
  } catch (err) {
    console.error("Error registering user:", err);
    throw err;
  }
};

userSchema.methods.verifyUser = async function () {
  this.verified = true;
  this.expiresAt = undefined; // Remove field
  await this.save();
};

// Function to authenticate the user
userSchema.methods.authenticateUser = async function (enteredPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
  } catch (err) {
    console.error("Error authenticating user:", err);
    return false;
  }
};

// Instance Method: Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      name: this.name,
      email: this.email,
      verified: this.verified,
      subscription: this.subscription,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Instance Method: Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Instance Method: Activate Subscription
userSchema.methods.activateSubscription = function (months) {
  const currentDate = new Date();
  const endDate = new Date(
    currentDate.setMonth(currentDate.getMonth() + months)
  );
  this.subscription.isActive = true;
  this.subscription.startDate = new Date();
  this.subscription.endDate = endDate;
  return this.save();
};

const User = mongoose.model("User", userSchema, "User");

export default User;
