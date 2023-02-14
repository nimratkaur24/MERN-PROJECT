import express from "express";
import {
  confirmEmail,
  forgotPassword,
  getLoggedUser,
  loginUser,
  registerUser,
  resetPassword,
  updateUser,
  uploadAvatar,
} from "../controllers/auth.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(authenticate, getLoggedUser);
router.route("/upload").post(authenticate, uploadAvatar);
router.route("/").put(authenticate, updateUser);
router.get("/confirmEmail", confirmEmail);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);

export default router;
