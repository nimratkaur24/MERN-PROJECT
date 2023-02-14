import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    match: [
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
      "Must contain at least 6 characters,uppercase,lowercase letter,special character and number",
    ],
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  confirmEmailToken: String,
  confirmEmailExpire: Date,
  phone: {
    type: String,
    match: [
      /^[+][0-9]{3}[\s-.]?[6][1-5][\s-.]?[0-9]{3}[\s-.]?[0-9]{3,4}$/,
      "Allowed number format examples: 1) +38761653789 2) +386 62 653 789 3) +384.64.653.7891 4) +387-63-653-789",
    ],
  },
  role: {
    type: String,
    enum: ["user", "publisher", "admin"],
    default: "user",
  },
  avatar: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Encrypting password using bcryptjs
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  if (this.isModified("avatar")) {
    console.log(this.cloudinary_id);
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// check if password matches
UserSchema.methods.matchPasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// get signed JWT token
UserSchema.methods.getSignedJWT = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// confirm email token
UserSchema.methods.generateVerificationToken = function (next) {
  const emailToken = crypto.randomBytes(20).toString("hex");

  this.confirmEmailToken = crypto
    .createHash("sha256")
    .update(emailToken)
    .digest("hex");

  const emailTokenExtend = crypto.randomBytes(100).toString("hex");
  const confirmTokenCombined = `${emailToken}.${emailTokenExtend}`;

  this.confirmEmailExpire = Date.now() + 10 * 60 * 1000;

  return confirmTokenCombined;
};

// Generate and hash password token for resset password
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire time to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  //vraćamo resetToken which is not hashed
  return resetToken;
};

export default mongoose.model("User", UserSchema);
