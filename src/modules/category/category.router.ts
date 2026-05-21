import express, { Router } from "express";
import { CategoryController } from "./category.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

// Public
router.get("/", CategoryController.getAllCategories);

// Admin only
router.post("/", auth(UserRole.ADMIN), CategoryController.createCategory);
router.put(
  "/:categoryId",
  auth(UserRole.ADMIN),
  CategoryController.updateCategory,
);
router.delete(
  "/:categoryId",
  auth(UserRole.ADMIN),
  CategoryController.deleteCategory,
);

export const categoryRouter: Router = router;
