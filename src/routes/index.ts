import express, { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { tutorRouter } from "../modules/tutor/tutor.router";
import { categoryRouter } from "../modules/category/category.router";
import { bookingRouter } from "../modules/booking/booking.router";

// const router = Router();
const router: Router = express.Router();

router.use("/users", userRouter);
router.use("/tutors", tutorRouter);
router.use("/categories", categoryRouter);
router.use("/bookings", bookingRouter);


export default router;
