import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const otpVerificationController = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({
        title: "Verification failed",
        message: "Unauthorized request",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        code: "unauthorized request",
      });
    }

    console.log("request email:", email);
    console.log("request otp:", otp);
    console.log("user otp:", user.otp);

    if (user.otp === otp) {
      await user.verifyUser();
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      return res.status(200).json({
        title: "User registration successful!",
        message: "User verified. You can now log in.",
        accessToken,
        refreshToken,
      });
    }

    res.status(400).json({
      title: "Verification failed",
      message: "OTP does not match. Please enter the correct OTP.",
    });
  } catch (error) {
    console.log(`An error occurred: ${error}`);
  }
};

export default otpVerificationController;
