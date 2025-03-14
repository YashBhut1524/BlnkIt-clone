import OrderModel from "../models/order.model.js";
import mongoose from "mongoose";

export const createCashOnDeliveryOrderController = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemList, totalAmt, subTotalAmt, delivery_address_id } = req.body;

        if (!itemList || !itemList.length) {
            return res.status(400).json({ 
                message: "Item list cannot be empty",
                error: true, 
                success: false 
            });
        }
        
        if (!delivery_address_id) {
            return res.status(400).json({ 
                message: "Delivery address is required",
                error: true, 
                success: false 
            });
        }

        const orderId = `ORD-${new mongoose.Types.ObjectId()}`;

        const filteredItems = itemList.map(item => ({
            productId: item.productId._id, // Extract product ID
            quantity: item.quantity // Keep quantity
        }));

        const newOrder = new OrderModel({
            userId,
            orderId,
            itemList: filteredItems,
            paymentId: "",
            payment_status: "Pending",
            delivery_address: delivery_address_id,
            subTotalAmt,
            totalAmt,
            order_status: "Pending", // Default status
            invoice_receipt: ""
        });
        console.log("newOrder: ", newOrder);

        await newOrder.save();

        return res.status(201).json({
            message: "Order placed successfully",
            success: true,
            order: newOrder
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong",
            success: false
        });
    }
};
