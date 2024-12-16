export class errorHandler extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  const message = err.message || "Internal server Error";
  const statuscode = err.statuscode || 500;

  //mongodb error cast error
  if (err.name === "CastError") {
    const message = `Resource not found`;
    err = new errorHandler(message, 400);
  }

  return res.status(statuscode).json({
    success: false,
    message,
  });
};
