import { Request, Response, NextFunction } from "express";
import { bookingService } from "./booking.service";
import { BookingStatus } from "../../../generated/prisma/enums";

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const result = await bookingService.createBooking({
      studentId: user.id,
      tutorProfileId: Number(req.body.tutorProfileId),
      scheduledAt: new Date(req.body.scheduledAt),
      duration: Number(req.body.duration),
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const getMyBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const result = await bookingService.getMyBookings(user.id, user.role);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch bookings", details: e });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const { bookingId } = req.params;
    const result = await bookingService.getBookingById(
      Number(bookingId),
      user.id,
    );
    res.status(200).json(result);
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "Failed to fetch booking";
    res.status(400).json({ error: errorMessage, details: e });
  }
};

const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const { bookingId } = req.params;
    const { status } = req.body;
    const result = await bookingService.updateStatus(
      Number(bookingId),
      user.id,
      user.role,
      status as BookingStatus,
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const BookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateStatus,
};
