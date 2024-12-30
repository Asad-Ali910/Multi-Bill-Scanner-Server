import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";

import crypto from "crypto";
import jwt from "jsonwebtoken";

import { sendMail } from "../utils/mailServices.js";
import {
  BadRequestError,
  ConflictError,
  LimitExceededError,
  NotFoundError,
  TimeoutError,
  UnauthorizedError,
} from "../utils/CustomError.js";
import { SuccessResponse } from "../utils/CustomResponse.js";

// Generate 6-digit OTP
const generateOTP = (length = 6) => {
  return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
};

// Register User
export const registerUser = async (req, res, next) => {
  try {
    const { fullname, username, email, password } = req.body;

    email = email.toLowerCase();

    // Basic Validation
    if (!fullname || !username || !email || !password) {
      throw new BadRequestError("All fields are required!");
    }

    if (!email.endsWith("@gmail.com")) {
      throw new BadRequestError("Email must end with '@gmail.com'.");
    }

    if (username.length < 4 || username.length > 20) {
      throw new BadRequestError("Username must be between 4 to 20 characters.");
    }

    if (password.length < 8 || password.length > 20) {
      throw new BadRequestError("Password must be between 8 to 20 characters.");
    }

    const userAlreadyExists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userAlreadyExists) {
      throw new ConflictError("Username or email already exists.");
    }

    const newUser = new User({ fullname, username, email, password });
    await newUser.save();

    const code = generateOTP();
    const newOtp = new Otp({ user: newUser._id, code });
    await newOtp.save();

    await sendMail(email, code);

    new SuccessResponse("Registration Successful! OTP sent.", {
      user: { email, username, fullname },
    }).send(res);
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new BadRequestError("Email and OTP are required!");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const otpRecord = await Otp.findOne({ user: user._id });
    if (!otpRecord) {
      throw new BadRequestError("OTP was not generated for this user.");
    }

    const isOtpCorrect = await otpRecord.isOtpCorrect(otp);
    if (!isOtpCorrect) {
      throw new BadRequestError("OTP is invalid.");
    }

    await Otp.deleteOne({ user: otpRecord.user });

    const refreshToken = await user.generateRefreshToken();
    const userData = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const responseUserData = { ...userData.toObject(), refreshToken };

    new SuccessResponse("Verification successful.", responseUserData).send(res);
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError("Username and password are required.");
    }

    const user = await User.findOne({ username });
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new BadRequestError("Username or password is incorrect.");
    }

    const refreshToken = await user.generateRefreshToken();
    const data = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const responseData = { ...data.toObject(), refreshToken };

    new SuccessResponse("Login successful.", responseData).send(res);
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError("Email is required!");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("User not found!");
    }

    let otpRecord = await Otp.findOne({ user: user._id });

    const code = generateOTP();

    if (!otpRecord) {
      otpRecord = new Otp({ user: user._id, code });
    } else {
      await otpRecord.incrementRequests();
      otpRecord.code = code;
      otpRecord.expiresIn = new Date(Date.now() + 600000);
    }

    await otpRecord.save();
    await sendMail(email, code);

    res.status(200).json({
      success: true,
      message: `OTP resent to ${email}`,
    });
  } catch (error) {
    next(error);
  }
};

export const editEmail = async (req, res, next) => {
  try {
    const { username, newEmail } = req.body;

    if (!(username && newEmail)) {
      throw new BadRequestError("Username and new email are required.");
    }

    const user = await User.findOne({ username });
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const userAlreadyExists = await User.findOne({ email: newEmail });
    if (userAlreadyExists) {
      throw new ConflictError("Email already exists.");
    }

    let otpRecord = await Otp.findOne({ user: user._id });
    const code = generateOTP();

    if (!otpRecord) {
      otpRecord = new Otp({ user: user._id, code });
    } else {
      otpRecord.code = code;
      await otpRecord.incrementRequests();
    }

    await otpRecord.save();
    user.email = newEmail;
    await user.save();

    await sendMail(newEmail, code);

    new SuccessResponse("Email edited successfully", { newEmail }).send(res);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new BadRequestError("Refresh Token not found");
    }

    try {
      const { _id } = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await User.findById(_id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedError("Unauthorized request");
      }

      user.refreshToken = null;
      await user.save();

      new SuccessResponse("Successfully logged out").send(res);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new UnauthorizedError("Refresh token expired.");
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};
