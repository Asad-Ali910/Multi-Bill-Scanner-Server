class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation Error (400)
export class BadRequestError extends CustomError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

// Unauthorized (401)
export class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// Forbidden (403)
export class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

// Not Found (404)
export class NotFoundError extends CustomError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

// Conflict (409)
export class ConflictError extends CustomError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

// Internal Server Error (500)
export class InternalServerError extends CustomError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}

export class LimitExceededError extends Error {
  constructor(message = "Limit exceeded.") {
    super(message);
    this.name = "LimitExceededError";
    this.statusCode = 429; // HTTP 429 Too Many Requests
  }
}

// utils/TimeoutError.js
export class TimeoutError extends Error {
  constructor(message = "Request timed out", statusCode = 408) {
    super(message);
    this.name = "TimeoutError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
