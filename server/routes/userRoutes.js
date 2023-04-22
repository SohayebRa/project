import express from "express";
const router = express.Router();

// Functions imports
import {
  formLogin,
  login,
  formSignup,
  signup,
  confirm,
  formForgotPassword,
  resetPassword,
  checkToken,
  newPassword,
} from "../controllers/userController.js";

// Routes
router.get("/login", formLogin);
router.post("/login", login);

router.get("/signup", formSignup);
router.post("/signup", signup);

router.get("/confirm/:token", confirm);

router.get("/forgot-password", formForgotPassword);
router.post("/forgot-password", resetPassword);

router.get("/forgot-password/:token", checkToken);
router.post("/forgot-password/:token", newPassword);

export default router;
