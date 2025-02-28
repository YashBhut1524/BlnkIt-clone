import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addProductController } from "../controllers/product.controller.js";

const productRouters = Router()

productRouters.post("/add-product", authMiddleware, addProductController)

export default productRouters;