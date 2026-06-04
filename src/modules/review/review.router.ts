import express, { Router } from "express";
import { ReviewController } from "./review.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.STUDENT), ReviewController.createReview);
router.get("/tutor/:tutorId", ReviewController.getTutorReviews);

export const reviewRouter: Router = router;
