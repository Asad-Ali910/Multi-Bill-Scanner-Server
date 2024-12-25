import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"

// Rpute : /api/Login
const LoginUserController = async (req, res) => {
  try {
    const { username, password, fingerPrint } = req.body;

    if (!username || !password) {
      return res.status(401).json({
        title: "login failed!",
        message: "username and password are required.",
      });
    }

    if (!fingerPrint) {
      return res.status(401).json({
        title: "login failed",
        message: "forbidden! make sure you are on an android.",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        title: "login failed!",
        message: "user doesn't Exists",
      });
    }

    if(!user.verified) {
      return res.status(400).json({
        code: "failed",
        message: "Your account is in pending state recreate after 10 mins"
      })
    }

    const authenticated = await user.authenticateUser(password);

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

    if (authenticated) {
        return res.status(200).json({
          title: "Login Success",
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: decoded,
        });
    }

    return res.status(400).json({
      title: "Login Failed",
      message: "Incorrect password",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      title: "Login Failed!",
      message: "login Failed Because of server error",
    });
  }
};

export default LoginUserController;
