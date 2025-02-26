import { Router } from "express"
import { 
    addCategoryController, 
    deleteCategoryController, 
    getCategoryController, 
    updateCategoryController 
} from "../controllers/category.controller.js"
import authMiddleware from "../middleware/authMiddleware.js"

const categoryRoutes = Router()

categoryRoutes.post("/add-category", authMiddleware, addCategoryController)
categoryRoutes.get("/get-category", getCategoryController)
categoryRoutes.put("/update-category", authMiddleware, updateCategoryController)
categoryRoutes.put("/delete-category", authMiddleware, deleteCategoryController)

export default categoryRoutes