import { Router } from "express";
import { 
    addProductController, 
    deleteProductController, 
    getProductsController, 
    updateProductController 
} from "../controllers/product.controller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const productRouters = Router()

productRouters.post("/add-product", authMiddleware, addProductController)
productRouters.post("/get-product", getProductsController)
productRouters.put("/update-product/:id", authMiddleware, updateProductController )
productRouters.delete("/delete-product/:id", authMiddleware, deleteProductController )

export default productRouters;