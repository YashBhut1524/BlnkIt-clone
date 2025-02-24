import { Router } from "express"
import { addCategoryController, getCategoryController } from "../controllers/category.controller.js"

import authMiddleware from "../middleware/authMiddleware.js"

const categoryRoutes = Router()

categoryRoutes.post("/add-category", authMiddleware, addCategoryController)
categoryRoutes.get("/get-category", getCategoryController)

export default categoryRoutes