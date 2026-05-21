import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { tutors: true } } },
  });
};

const createCategory = async (data: { name: string; icon?: string }) => {
  return await prisma.category.create({ data });
};

const updateCategory = async (
  categoryId: number,
  data: { name?: string; icon?: string },
) => {
  return await prisma.category.update({
    where: { id: categoryId },
    data,
  });
};

const deleteCategory = async (categoryId: number) => {
  return await prisma.category.delete({
    where: { id: categoryId },
  });
};

export const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
