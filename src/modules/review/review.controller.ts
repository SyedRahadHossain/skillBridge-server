import { Request, Response, NextFunction } from "express";
import { reviewService } from "./review.service";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const result = await reviewService.createReview({
      bookingId: Number(req.body.bookingId),
      studentId: user.id,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const getTutorReviews = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;
    const result = await reviewService.getTutorReviews(Number(tutorId));
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch reviews", details: e });
  }
};

export const ReviewController = {
  createReview,
  getTutorReviews,
};
