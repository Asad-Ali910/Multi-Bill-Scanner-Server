import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

// route: /api/ValidateAccessToken

const ValidateAccessToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Access Token Recieved");

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    // Synchronous verification (throws error if invalid/expired)
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("Decoded Token Belongs to: ", decoded.name);
    const email = decoded.email;
    console.log("Decoded Token Belongs to: ", email);

    const UserExists = User.findOne({ email });

    if (!UserExists) {
      return res.status(400).json({
        message: "user does not exists",
        isValid: false,
      });
    }

    return res.status(200).json({
      message: "Authorized",
      user: decoded,
      isValid: true,
    });
  } catch (err) {
    console.log("Access Token Error: ACCESS_TOKEN_INVALID");

    return res.status(401).json({
      code: "ACCESS_TOKEN_INVALID",
      message: "The provided access token is invalid or expired.",
      isValid: false,
    });
  }
};

// route: /api/ValidateRefreshToken
const ValidateRefreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  console.log("Refresh Token: Recieved");

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token missing",
    });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decode) => {
      if (err) {
        console.log("Refresh Token Error: Token is Invalid or Expired");
        return res.status(403).json({
          code: "REFRESH_TOKEN_INVALID",
          message: "The provided refresh token is invalid or expired.",
        });
      }

      const id = decode._id;

      const user = await User.findOne({ _id: id });

      if (!user) {
        return res.status(400).json({
          isValid: false,
          code: "not authorized",
        });
      }

      // Optionally regenerate a new access token
      const newAccessToken = await user.generateAccessToken();

      const decoded = jwt.verify(
        newAccessToken,
        process.env.ACCESS_TOKEN_SECRET
      );

      return res.status(200).json({
        message: "Refresh token valid",
        user: decoded,
        newAccessToken,
        refreshToken,
      });
    }
  );
};

export { ValidateAccessToken, ValidateRefreshToken };
