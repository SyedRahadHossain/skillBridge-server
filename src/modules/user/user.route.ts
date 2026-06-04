import express, { Router } from "express";
import { UserController } from "./user.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/me",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  UserController.getMe,
);

export const userRouter: Router = router;
