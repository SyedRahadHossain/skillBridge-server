import express, { Router } from "express";
import { AdminController } from "./admin.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);
router.patch(
  "/users/:userId",
  auth(UserRole.ADMIN),
  AdminController.updateUserStatus,
);
router.get("/bookings", auth(UserRole.ADMIN), AdminController.getAllBookings);
router.get("/stats", auth(UserRole.ADMIN), AdminController.getStats);

export const adminRouter: Router = router;
