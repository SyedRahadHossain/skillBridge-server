import { prisma } from "../../lib/prisma";

const createReview = async (data: {
    bookingId: number;
    studentId: string;
    rating: number;
    comment?: string;
}) => {
    const booking = await prisma.booking.findUniqueOrThrow({
        where: { id: data.bookingId },
        include: { review: true }
    });

    if (booking.studentId !== data.studentId) {
        throw new Error("You are not authorized to review this booking!");
    }

    if (booking.status !== "completed") {
        throw new Error("You can only review completed bookings!");
    }

    if (booking.review) {
        throw new Error("You have already reviewed this booking!");
    }

    const review = await prisma.review.create({
        data: {
            bookingId: data.bookingId,
            studentId: data.studentId,
            tutorProfileId: booking.tutorProfileId,
            rating: data.rating,
            comment: data.comment ?? null
        }
    });

    // Recalculate tutor average rating
    const stats = await prisma.review.aggregate({
        where: { tutorProfileId: booking.tutorProfileId },
        _avg: { rating: true },
        _count: { rating: true }
    });

    await prisma.tutorProfile.update({
        where: { id: booking.tutorProfileId },
        data: {
            rating: Math.round((stats._avg.rating ?? 0) * 10) / 10,
            totalReviews: stats._count.rating
        }
    });

    return review;
};

const getTutorReviews = async (tutorProfileId: number) => {
    return await prisma.review.findMany({
        where: { tutorProfileId },
        include: {
            student: { select: { id: true, name: true, image: true } }
        },
        orderBy: { createdAt: "desc" }
    });
};

export const reviewService = {
    createReview,
    getTutorReviews
};
