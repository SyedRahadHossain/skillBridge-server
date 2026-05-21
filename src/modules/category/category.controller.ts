import { Request, Response, NextFunction } from "express";
import { categoryService } from "./category.service";

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "Failed to fetch categories", details: e });
  }
};

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryService.updateCategory(
      Number(categoryId),
      req.body,
    );
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const result = await categoryService.deleteCategory(Number(categoryId));
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const CategoryController = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
