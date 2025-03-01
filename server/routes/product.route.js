import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addProductController, getProductsController } from "../controllers/product.controller.js";

const productRouters = Router()

productRouters.post("/add-product", authMiddleware, addProductController)
productRouters.post("/get-product", getProductsController)

export default productRouters;