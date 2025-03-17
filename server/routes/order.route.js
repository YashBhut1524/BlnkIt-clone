import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js"
import { 
    createCashOnDeliveryOrderController, 
    createStripePaymentOrderController, 
    getAllOrdersController, 
    getOrderDetailsByIdCOntroller, 
    getOrdersController,
    razorpayPaymentOrderController,
    razorpayPaymentVerification,
    stripeWebhookPayment,
    updateOrderStatusController
} from "../controllers/order.controller.js";

const orderRouters = Router()

orderRouters.post("/add-cash-on-delivery-order", authMiddleware, createCashOnDeliveryOrderController)
orderRouters.get("/get-orders", authMiddleware, getOrdersController)
orderRouters.get("/get-all-orders", authMiddleware, getAllOrdersController)
orderRouters.put("/update-order-status-admin", authMiddleware, updateOrderStatusController)
orderRouters.post("/add-stripe-payment-checkout", authMiddleware, createStripePaymentOrderController)
orderRouters.post("/webhook", stripeWebhookPayment)
orderRouters.post("/add-razor-payment-checkout", authMiddleware, razorpayPaymentOrderController)
orderRouters.post("/razorpay-payment-verification", razorpayPaymentVerification);
orderRouters.post("/get-order-details-by-id", authMiddleware, getOrderDetailsByIdCOntroller)

export default orderRouters