// errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      customCode: err.customCode || null,
      details: err.details || null,
      timestamp: err.timestamp,
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred. Please try again later.',
  });
};

export default errorMiddleware;
