import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import {
  UnAuthenticatedError,
  UnAuthorizedError,
} from "../utils/errorResponse.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new UnAuthenticatedError("Not authorized to access this route")
    );
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(
      new UnAuthenticatedError("Not authorized to access this route")
    );
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new UnAuthorizedError(`User is not authorized to access this route`)
      );
    }
    next();
  };
};
