import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { prisma } from "../../lib/prisma";

const getMyProfile = async (userId: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      categories: { include: { category: true } },
    },
  });
  return tutor;
};

const getAllTutors = async (query: {
  search?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const { search, categoryId, minPrice, maxPrice, minRating } = query;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationSortingHelper(query);

  const andConditions: any[] = [{ user: { isActive: true } }];

  if (search) {
    andConditions.push({
      OR: [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { bio: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (categoryId) {
    andConditions.push({
      categories: { some: { categoryId: Number(categoryId) } },
    });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      hourlyRate: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    });
  }

  if (minRating) {
    andConditions.push({ rating: { gte: Number(minRating) } });
  }

  const [tutors, total] = await Promise.all([
    prisma.tutorProfile.findMany({
      where: { AND: andConditions },
      include: {
        user: { select: { id: true, name: true, image: true } },
        categories: { include: { category: true } },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.tutorProfile.count({ where: { AND: andConditions } }),
  ]);

  return {
    data: tutors,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getTutorById = async (tutorId: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: Number(tutorId) },
    include: {
      user: { select: { id: true, name: true, image: true, createdAt: true } },
      categories: { include: { category: true } },
      reviews: {
        include: {
          student: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!tutor) {
    throw new Error("Tutor not found!");
  }

  return tutor;
};

const updateProfile = async (
  userId: string,
  data: {
    bio?: string;
    hourlyRate?: number;
    experience?: number;
    categoryIds?: number[];
  },
) => {
  const { categoryIds, ...profileData } = data;

  const tutor = await prisma.tutorProfile.upsert({
    where: { userId },
    create: { userId, hourlyRate: profileData.hourlyRate ?? 0, ...profileData },
    update: profileData,
  });

  if (categoryIds !== undefined) {
    await prisma.tutorCategory.deleteMany({
      where: { tutorProfileId: tutor.id },
    });
    if (categoryIds.length > 0) {
      await prisma.tutorCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          tutorProfileId: tutor.id,
          categoryId,
        })),
        skipDuplicates: true,
      });
    }
  }

  return await prisma.tutorProfile.findUnique({
    where: { id: tutor.id },
    include: { categories: { include: { category: true } } },
  });
};

const updateAvailability = async (userId: string, availability: any) => {
  return await prisma.tutorProfile.update({
    where: { userId },
    data: { availability },
  });
};

export const tutorService = {
  getMyProfile,
  getAllTutors,
  getTutorById,
  updateProfile,
  updateAvailability,
};
