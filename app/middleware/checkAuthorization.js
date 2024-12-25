import jwt from "jsonwebtoken";

const checkAuthorization = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token)

  if (!token) {
    return res.status(403).json({
      message: "Access Token Required",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // If token is invalid or expired
      return res.status(401).json({
        message: "Unauthorized request",
      });
    }

    // Attach user information to the request object (optional)
    req.user = decoded;

    console.log(decoded)

    // Proceed to the next middleware or route handler
    next();
  });
};

export default checkAuthorization;
