import express, { Router } from "express";
import { BookingController } from "./booking.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

// Only logged-in students can see a tutor's booked time slots
router.get(
  "/tutor/:tutorProfileId/busy",
  auth(UserRole.STUDENT),
  BookingController.getBusySlots,
);

router.post("/", auth(UserRole.STUDENT), BookingController.createBooking);
router.get(
  "/",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  BookingController.getMyBookings,
);
router.get(
  "/:bookingId",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  BookingController.getBookingById,
);
router.patch(
  "/:bookingId/status",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  BookingController.updateStatus,
);

export const bookingRouter: Router = router;
