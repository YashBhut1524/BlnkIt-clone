import { Router } from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { 
    createCashOnDeliveryOrderController 
} from "../controllers/order.controller.js";

const orderRouters = Router()

orderRouters.post("/add-cash-on-delivery-order", authMiddleware, createCashOnDeliveryOrderController)

export default orderRouters