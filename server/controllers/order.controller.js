import OrderModel from "../models/order.model.js";
import mongoose from "mongoose";

export const createCashOnDeliveryOrderController = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Please loging to access this endpoint.",
                success: false,
                error: true
            });
        }

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

        const generateOrderId = () => {
            const randomNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
            const now = new Date();
            const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Month (2 digits)
            const day = String(now.getDate()).padStart(2, '0'); // Day (2 digits)
        
            return `ORD${randomNumber}${day}${month}${year}`;
        };
        
        const orderId = generateOrderId();
        

        const filteredItems = itemList.map(item => ({
            productId: item.productId._id, // Extract product ID
            quantity: item.quantity // Keep quantity
        }));

        const newOrder = new OrderModel({
            userId,
            orderId,
            itemList: filteredItems,
            paymentId: "",
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

export const getAllOrdersController = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Please loging to access this endpoint.",
                success: false,
                error: true
            });
        }

        const user = await UserModel.findById(userId);

        if(!user) {
            return res.status(401).json({
                message: "User does not Exist.",
                success: false,
                error: true
            });
        }

        if(user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Only admin can access this endpoint.",
                success: false,
                error: true
            });
        }

        const orders = await OrderModel.find()
            .populate("itemList.productId") // Corrected population inside itemList array
            .populate("delivery_address");

        return res.status(200).json({
            message: "Orders fetched successfully.",
            success: true,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong",
            success: false
        });
    }
};


export const getOrdersController = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Please loging to access this endpoint.",
                success: false,
                error: true
            });
        }

        const orders = await OrderModel.find({ userId })
            .populate("itemList.productId") // Corrected population inside itemList array
            .populate("delivery_address");


        return res.status(200).json({
            message: "Orders fetched successfully.",
            success: true,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong",
            success: false
        });
    }
};
