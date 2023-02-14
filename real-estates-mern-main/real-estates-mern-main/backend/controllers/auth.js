import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnAuthenticatedError,
} from "../utils/errorResponse.js";
import crypto from "crypto";
import { cloudinary } from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return next(new BadRequestError("Please provide all values"), 400);
  }

  const doesUserExist = await User.findOne({ email });

  if (doesUserExist) {
    return next(new BadRequestError("User already exists"), 400);
  }

  const user = await new User(req.body);

  const verificationToken = user.generateVerificationToken();

  // frontend url. When user hits this url,we will make request from frontend to backend url(/api/v1/auth/confirmEmail?token=...) to confirm email.
  const url = `${req.protocol}://localhost:3000/confirmEmail?token=${verificationToken}`; // - prod mode
  // const url = `${req.protocol}://localhost:3000/confirmEmail?token=${verificationToken}`; - dev mode

  user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Email confirmation",
      html: `<h4>${user.name},thanks for registration. We are glad to have you with us.</h4> Click here <a href="${url}"<a/> to confirm your email address.`,
    });
  } catch (error) {
    user.confirmEmailToken = undefined;
    user.confirmEmailExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new InternalServerError("Email could not be sent"));
  }

  sendTokenResponse(user, 201, res, `Email sent to ${user.email}`);
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Please provide all values"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new NotFoundError("User not found"));
  }

  if (!user.isEmailConfirmed) {
    return next(new UnAuthenticatedError("Please confirm your email to login"));
  }

  const match = await user.matchPasswords(password);

  if (!match) {
    return next(new UnAuthenticatedError("Invalid credentials"));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getLoggedUser = asyncHandler(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);

  if (!currentUser) {
    return next(new NotFoundError("User not found"));
  }

  // removing __v property
  const currentUserCopy = {
    _id: currentUser._id,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    phone: currentUser.phone,
    avatar: currentUser?.avatar,
    cloudinary_id: currentUser?.cloudinary_id,
    isEmailConfirmed: currentUser.isEmailConfirmed,
  };

  res.status(200).json({ success: true, user: currentUserCopy });
});

// @desc    Update user
// @route   PUT /api/v1/auth
// @access  Private
export const updateUser = asyncHandler(async (req, res, next) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new NotFoundError("User not found"));
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, updatedUser });
});

// @desc    Upload user avatar
// @route   POST /api/v1/auth/upload
// @access  Private
export const uploadAvatar = asyncHandler(async (req, res, next) => {
  const fileStr = req.body.data;
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new NotFoundError("User not found"));
  }

  // If it's user first upload,he will have cloudinary_id of undefined,so we just do upload picture. If it isn't his first upload,he will have valid cloudinary_id already stored,so we first destroy that cloudinary_id from cloudinary service and then we upload new image.
  try {
    if (req.user.cloudinary_id !== undefined) {
      await cloudinary.uploader.destroy(req.user.cloudinary_id, async () => {
        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
          upload_preset: "real-estates",
        });
        user.avatar = uploadedResponse.secure_url;
        user.cloudinary_id = uploadedResponse.public_id;
        await user.save();
        res.status(201).json({ success: true, image: user.avatar });
      });
    } else {
      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "real-estates",
      });
      user.avatar = uploadedResponse.secure_url;
      user.cloudinary_id = uploadedResponse.public_id;
      await user.save();
      res.status(201).json({ success: true, image: user.avatar });
    }
  } catch (error) {
    res.status(500).json({ success: true, error: error.message });
  }
});

// @desc    Verfiy Account
// @route   GET /api/v1/auth/confirmEmail
// @access  Public
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(new BadRequestError("Invalid token"));
  }

  const splitToken = token.split(".")[0];

  // Get hashed token
  const confirmEmailToken = crypto
    .createHash("sha256")
    .update(splitToken)
    .digest("hex");

  const user = await User.findOne({
    confirmEmailToken,
    confirmEmailExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new BadRequestError("Invalid token"));
  }

  // set isVerified to true
  user.isEmailConfirmed = true;
  user.confirmEmailToken = undefined;
  user.confirmEmailExpire = undefined;

  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new NotFoundError(`There is no user with that email`));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  // Snimanje usera u bazu
  await user.save({ validateBeforeSave: false });

  // Create reset url - for frontend in development mode
  // const resetUrl = `${req.protocol}://localhost:3000/resetPassword?resetToken=${resetToken}`;

  // Create rest url - for frontend in production mode
  const resetUrl = `${req.protocol}://real-estates-mern.herokuapp.com/resetPassword?resetToken=${resetToken}`;

  // sending email via sendEmail fnction
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      html: `<h4> You are receiving this email because you (or someone else) has requested the reset of password.</h4> Please click <a href="${resetUrl}"> here </a> to navigate to reset password page. `,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new InternalServerError("Email could not be sent"));
  }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetPassword?resetToken
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetToken } = req.query;

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new BadRequestError(`Invalid token`), 400);
  }

  // Set new password
  user.password = req.body.password.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Snimanje usera u bazu
  await user.save();

  sendTokenResponse(user, 200, res);
});

// send token as response
const sendTokenResponse = (user, statusCode, response, msg) => {
  const token = user.getSignedJWT();

  response
    .status(statusCode)
    .json({ success: true, token, message: msg !== "" ? msg : undefined });
};
