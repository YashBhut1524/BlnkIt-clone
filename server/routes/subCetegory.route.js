import { Router } from "express";
import { 
    addSubCategoryController, 
    deleteSubCategoryController, 
    getSubCategoriesController, 
    updateSubCategoryController 
} from "../controllers/subCategory.controller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const subCategoryRoutes = Router()

subCategoryRoutes.post("/add-sub-category", authMiddleware, addSubCategoryController)
subCategoryRoutes.post("/get-sub-category", getSubCategoriesController)
subCategoryRoutes.put("/update-sub-category", authMiddleware, updateSubCategoryController)
subCategoryRoutes.put("/delete-sub-category", authMiddleware, deleteSubCategoryController)

export default subCategoryRoutes;