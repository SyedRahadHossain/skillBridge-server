import { Role } from "../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { prisma } from "../../lib/prisma";

const getAllUsers = async (query: {
  role?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const { role } = query;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationSortingHelper(query);

  const where: any = {};
  if (role) where.role = role;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        tutorProfile: {
          select: { rating: true, totalReviews: true, hourlyRate: true },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const updateUserStatus = async (
  userId: string,
  data: { isActive?: boolean; role?: string },
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.role !== undefined && { role: data.role as Role }),
    },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
};

const getStats = async () => {
  const [
    totalUsers,
    totalTutors,
    totalStudents,
    totalBookings,
    completedBookings,
    cancelledBookings,
    totalReviews,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "tutor" } }),
    prisma.user.count({ where: { role: "student" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "completed" } }),
    prisma.booking.count({ where: { status: "cancelled" } }),
    prisma.review.count(),
  ]);

  return {
    totalUsers,
    totalTutors,
    totalStudents,
    totalBookings,
    completedBookings,
    cancelledBookings,
    totalReviews,
  };
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getStats,
};
