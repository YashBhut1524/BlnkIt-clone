import { Router } from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { 
    createCashOnDeliveryOrderController, 
    getAllOrdersController, 
    getOrdersController,
    updateOrderStatusController
} from "../controllers/order.controller.js";

const orderRouters = Router()

orderRouters.post("/add-cash-on-delivery-order", authMiddleware, createCashOnDeliveryOrderController)
orderRouters.get("/get-orders", authMiddleware, getOrdersController)
orderRouters.get("/get-all-orders", authMiddleware, getAllOrdersController)
orderRouters.put("/update-order-status-admin", authMiddleware, updateOrderStatusController)

export default orderRouters