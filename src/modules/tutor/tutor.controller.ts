import { Request, Response, NextFunction } from "express";
import { tutorService } from "./tutor.service";

const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized!" });
    const result = await tutorService.getMyProfile(user.id);
    res.status(200).json({ data: result });
  } catch (e) {
    next(e);
  }
};

const getAllTutors = async (req: Request, res: Response) => {
  try {
    const result = await tutorService.getAllTutors(req.query as any);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch tutors", details: e });
  }
};

const getTutorById = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;
    const result = await tutorService.getTutorById(tutorId as string);
    res.status(200).json(result);
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "Failed to fetch tutor";
    res.status(400).json({ error: errorMessage, details: e });
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const result = await tutorService.updateProfile(user.id, req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const updateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const result = await tutorService.updateAvailability(
      user.id,
      req.body.availability,
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const TutorController = {
  getMyProfile,
  getAllTutors,
  getTutorById,
  updateProfile,
  updateAvailability,
};
