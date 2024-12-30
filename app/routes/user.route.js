import express from "express";
import {
  editEmail,
  login,
  logout,
  registerUser,
  resendOtp,
  verifyOtp,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(login);
userRouter.route("/verify-otp").post(verifyOtp);
userRouter.route("/resend-otp").post(resendOtp);
userRouter.route("/edit-email").post(editEmail);
userRouter.route("/logout").post(logout);

export default userRouter;
