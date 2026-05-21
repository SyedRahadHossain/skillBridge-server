import express, { Router } from "express";
import { TutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

// Tutor only
router.get("/profile/me", auth(UserRole.TUTOR), TutorController.getMyProfile);
router.put("/profile/me", auth(UserRole.TUTOR), TutorController.updateProfile);
router.put(
  "/availability/me",
  auth(UserRole.TUTOR),
  TutorController.updateAvailability,
);

// Public
router.get("/", TutorController.getAllTutors);
router.get("/:tutorId", TutorController.getTutorById);

export const tutorRouter: Router = router;
