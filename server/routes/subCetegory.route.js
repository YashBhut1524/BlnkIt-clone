import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { 
    addSubCategoryController, 
    deleteSubCategoryController, 
    getSubCategoriesController, 
    updateSubCategoryController 
} from "../controllers/subCategory.controller.js";

const subCategoryRoutes = Router()

subCategoryRoutes.post("/add-sub-category", authMiddleware, addSubCategoryController)
subCategoryRoutes.post("/get-sub-category", authMiddleware, getSubCategoriesController)
subCategoryRoutes.put("/update-sub-category", authMiddleware, updateSubCategoryController)
subCategoryRoutes.put("/delete-sub-category", authMiddleware, deleteSubCategoryController)

export default subCategoryRoutes;