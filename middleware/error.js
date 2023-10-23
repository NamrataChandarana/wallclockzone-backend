export class errorHandler extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal server Error";
  err.statuscode = err.statuscode || 500;

  //mongodb error cast error
  if (err.name === "CastError") {
    const message = `Resource not found`;
    err = new errorHandler(message, 400);
  }

  res.status(404).json({
    success: false,
    message: err.message,
  });
};
