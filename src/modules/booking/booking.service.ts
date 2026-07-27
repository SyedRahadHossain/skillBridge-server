import { BookingStatus } from "../../generated/enums";
import { prisma } from "../../lib/prisma";

const bookingInclude = {
  student: { select: { id: true, name: true, image: true } },
  tutorProfile: {
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  },
};

function timeStringToMinutes(time: string) {
  const parts = time.split(":");
  const h = parseInt(parts[0] ?? "0", 10);
  const m = parseInt(parts[1] ?? "0", 10);
  return h * 60 + m;
}

const createBooking = async (data: {
  studentId: string;
  tutorProfileId: number;
  scheduledAt: Date;
  duration: number;
  startTime?: string;
  bookingDay?: string;
}) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: data.tutorProfileId },
  });

  if (!tutor) throw new Error("Tutor not found!");

  const availability = tutor.availability as Array<{
    day: string;
    from: string;
    to: string;
  }>;

  if (availability && availability.length > 0) {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Use client-sent bookingDay if available, else fall back to parsing date
    const bookingDay =
      data.bookingDay ?? dayNames[data.scheduledAt.getDay()] ?? "Unknown";

    const dayAvailability = availability.find(
      (a) => a.day.toLowerCase() === bookingDay.toLowerCase(),
    );

    if (!dayAvailability) {
      throw new Error(`Tutor is not available on ${bookingDay}`);
    }

    // Use client-sent startTime if available, else parse from date
    const bookingStartMinutes = data.startTime
      ? timeStringToMinutes(data.startTime)
      : data.scheduledAt.getHours() * 60 + data.scheduledAt.getMinutes();

    const bookingEndMinutes = bookingStartMinutes + data.duration;

    const [fromH = 0, fromM = 0] = dayAvailability.from.split(":").map(Number);
    const [toH = 23, toM = 59] = dayAvailability.to.split(":").map(Number);
    const availableFrom = fromH * 60 + fromM;
    const availableTo = toH * 60 + toM;

    if (
      bookingStartMinutes < availableFrom ||
      bookingEndMinutes > availableTo
    ) {
      throw new Error(
        `Tutor is only available from ${dayAvailability.from} to ${dayAvailability.to} on ${bookingDay}`,
      );
    }
  }

  const totalPrice =
    Math.round((tutor.hourlyRate / 60) * data.duration * 100) / 100;

  // Don't store startTime/bookingDay in the database
  const { startTime, bookingDay, ...bookingData } = data;

  return await prisma.booking.create({
    data: { ...bookingData, totalPrice, status: "confirmed" },
    include: bookingInclude,
  });
};

const getMyBookings = async (userId: string, role: string) => {
  const where =
    role === "student" ? { studentId: userId } : { tutorProfile: { userId } };

  return await prisma.booking.findMany({
    where,
    include: { ...bookingInclude, review: true },
    orderBy: { scheduledAt: "desc" },
  });
};

const getBookingById = async (bookingId: number, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { ...bookingInclude, review: true },
  });

  if (!booking) throw new Error("Booking not found!");

  const isStudent = booking.studentId === userId;
  const isTutor = booking.tutorProfile.userId === userId;

  if (!isStudent && !isTutor)
    throw new Error("You are not authorized to view this booking!");

  return booking;
};

const updateStatus = async (
  bookingId: number,
  userId: string,
  role: string,
  status: BookingStatus,
) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { tutorProfile: true },
  });

  if (role === "student") {
    if (booking.studentId !== userId) throw new Error("Forbidden!");
    if (status !== "cancelled")
      throw new Error("Students can only cancel bookings!");
  }

  if (role === "tutor") {
    if (booking.tutorProfile.userId !== userId) throw new Error("Forbidden!");
    if (status !== "completed")
      throw new Error("Tutors can only mark bookings as completed!");
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: bookingInclude,
  });
};

const getAllBookings = async (query: {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const { page, limit, skip, sortBy, sortOrder } =
    require("../../helpers/paginationSortingHelper.ts").default(query);

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      include: bookingInclude,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.booking.count(),
  ]);

  return {
    data: bookings,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateStatus,
  getAllBookings,
};
