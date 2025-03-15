import { Router } from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { 
    addToCartItemController, 
    deleteItemFromCartController, 
    emptyCartController, 
    getCartItemsController, 
    updateCartItemQuantityController
} from "../controllers/cart.controller.js"

const cartRoutes = Router()

cartRoutes.post("/create-cart", authMiddleware, addToCartItemController)
cartRoutes.get("/get-cart-items", authMiddleware, getCartItemsController)
cartRoutes.put("/update-cart-item-quantity", authMiddleware, updateCartItemQuantityController)
cartRoutes.delete("/delete-cart-item", authMiddleware, deleteItemFromCartController)
cartRoutes.delete("/empty-the-cart", authMiddleware, emptyCartController)

export default cartRoutes