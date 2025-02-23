import { Router } from "express"
import { addCategoryController } from "../controllers/category.controller.js"

import authMiddleware from "../middleware/authMiddleware.js"

const categoryRoutes = Router()

categoryRoutes.post("/add-category", authMiddleware, addCategoryController)

export default categoryRoutes