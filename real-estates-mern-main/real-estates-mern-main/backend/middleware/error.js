import { BadRequestError, NotFoundError } from "../utils/errorResponse.js";

const notFound = (req, res, next) => {
  return next(new NotFoundError(`Not found - ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for developer
  console.log(err.stack);

  //Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new NotFoundError(message);
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new BadRequestError(message);
  }

  //Mongoose validation error(missing field error)
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new BadRequestError(message);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

export { notFound, errorHandler };
