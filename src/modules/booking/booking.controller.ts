import { NextFunction, Request, Response } from "express";
import { bookingService } from "./booking.service";
import { BookingStatus } from "../../generated/enums";

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
      startTime: req.body.startTime,
      bookingDay: req.body.bookingDay,
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
const getBusySlotsRange = async (req: Request, res: Response) => {
  try {
    const { tutorProfileId } = req.params;
    const { from, to } = req.query;

    if (!from || !to || typeof from !== "string" || typeof to !== "string") {
      return res
        .status(400)
        .json({
          message: "from and to query params (YYYY-MM-DD) are required",
        });
    }

    const result = await bookingService.getBusySlotsRange(
      Number(tutorProfileId),
      from,
      to,
    );
    res.status(200).json({ data: result });
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "Failed to fetch busy range";
    res.status(400).json({ error: errorMessage, details: e });
  }
};
const getBusySlots = async (req: Request, res: Response) => {
  try {
    const { tutorProfileId } = req.params;
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      return res
        .status(400)
        .json({ message: "date query param (YYYY-MM-DD) is required" });
    }

    const result = await bookingService.getBusySlots(
      Number(tutorProfileId),
      date,
    );
    res.status(200).json({ data: result });
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "Failed to fetch busy slots";
    res.status(400).json({ error: errorMessage, details: e });
  }
};

export const BookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateStatus,
  getBusySlotsRange,
  getBusySlots,
};
