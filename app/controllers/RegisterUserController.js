import User from "../models/UserModel.js";
import crypto from "crypto"
import { sendOtp } from "../utils/sendOtp.js"

const RegisterUserController = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;

    // Ensure all required fields are provided
    if (!name || !username || !password || !email) {
      return res.status(400).json({
        error: true,
        title: "User Registration Failed!",
        message:
          "Missing required fields: name, username, password, and email are all required.",
      });
    }

    if (name.length > 15) {
      return res.status(400).json({
        error: true,
        title: "User Registration Failed!",
        message: "name can't be more than 15 letters.",
      });
    }

    if(username.length < 5 || username.length > 18) {
      return res.status(400).json({
        error: true,
        title: "registration failed!",
        message: "username should be atleast 5 characters and maximum 18 characters."
      })
    }

    // Check if the email is valid (ends with '@gmail.com')
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({
        error: true,
        title: "User Registration Failed!",
        message: "Invalid email format. It must end with '@gmail.com'.",
      });
    }

    if (email.includes(" ")) {
      return {
        error: true,
        title: "User Registration Failed!",
        message: "Registration failed! Email must not contain spaces.",
      };
    }

    if (password.length < 8 || password.length > 20) {
      return res.status(400).json({
        
      })
    }

    // Check if the email or username already exists
    const userAlreadyExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userAlreadyExists) {
      return res.status(409).json({
        error: true,
        title: "User Registration Failed!",
        message: "Username or email already Taken.",
      });
    }

          
    const otp = crypto.randomInt(100000, 999999).toString();
    const newUser = await User.registerUser(name, username, email, password, otp)
    
    await sendOtp(email, otp);
    // Respond with success message
    return res.status(200).json({
      title: "otp verification required!",
      message:
        "Please enter the 6 digit otp sent to you gmail.",
    });
  } catch (error) {
    console.error("Error Registering User: ", error);
    return res.status(500).json({
      error: true,
      title: "Internal Server Error",
      message:
        "An error occurred while registering the user. Please try again later.",
    });
  }
};

export default RegisterUserController;