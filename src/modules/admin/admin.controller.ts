import { Request, Response, NextFunction } from "express";
import { adminService } from "./admin.service";
import { bookingService } from "../booking/booking.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllUsers(req.query as any);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch users", details: e });
  }
};

const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const { userId } = req.params;

    if (user?.id === userId) {
      return res
        .status(400)
        .json({ message: "You cannot modify your own account!" });
    }

    const { isActive, role } = req.body;
    const result = await adminService.updateUserStatus(userId as string, {
      isActive,
      role,
    });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.getAllBookings(req.query as any);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch bookings", details: e });
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getStats();
    res.status(200).json(result);
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "Failed to fetch stats";
    res.status(400).json({ error: errorMessage, details: e });
  }
};

export const AdminController = {
  getAllUsers,
  updateUserStatus,
  getAllBookings,
  getStats,
};
