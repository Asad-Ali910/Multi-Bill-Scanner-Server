export class SuccessResponse {
  constructor(message, data = {}) {
    this.status = "success";
    this.message = message;
    this.data = data;
  }

  send(res, statusCode = 201) {
    res.status(statusCode).json({
      status: this.status,
      message: this.message,
      data: this.data,
    });
  }
}
