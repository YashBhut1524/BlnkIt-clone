import { Router } from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { 
    createCashOnDeliveryOrderController, 
    getOrdersController
} from "../controllers/order.controller.js";

const orderRouters = Router()

orderRouters.post("/add-cash-on-delivery-order", authMiddleware, createCashOnDeliveryOrderController)
orderRouters.get("/get-orders", authMiddleware, getOrdersController)

export default orderRouters