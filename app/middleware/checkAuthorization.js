import jwt from "jsonwebtoken";

// Authorization Middleware
const checkAuthorization = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      message: "Access Token Required",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized request",
      });
    }

    res.status(200).json({
      billData: req.billData,
    });
  });
};

export default checkAuthorization;
