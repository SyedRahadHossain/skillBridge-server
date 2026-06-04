import { prisma } from "../../lib/prisma";

const getMe = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      image: true,
      createdAt: true,
      tutorProfile: {
        select: {
          id: true,
          bio: true,
          hourlyRate: true,
          experience: true,
          rating: true,
          totalReviews: true,
          availability: true,
          categories: {
            include: { category: true },
          },
        },
      },
    },
  });
};

export const userService = {
  getMe,
};
