import OrderModel from "../models/order.model.js";
import mongoose from "mongoose";
import UserModel from "../models/user.model.js"
import dotenv from "dotenv";
import Stripe from "../config/stripe.js";
import { pricewithDiscount } from "../utils/PriceWithDiscount.js";
import { emptyCartController } from "./cart.controller.js";
import CartProductModel from "../models/cartProduct.model.js";
// import Stripe from "../config/stripe.js";

dotenv.config(); // Load environment variables
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

        const { 
            itemList, 
            totalAmt, 
            subTotalAmt, 
            delivery_address_id,
            otherCharge
        } = req.body;

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

export const createStripePaymentOrderController = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            itemList,
            totalAmt,
            subTotalAmt,
            delivery_address_id,
            otherCharge
        } = req.body;
        // console.log("totalAmt: ", totalAmt);
        // console.log("subTotalAmt: ", subTotalAmt);
        // console.log("otherCharge: ", otherCharge);

        if (!userId) {
            return res.status(401).json({
                message: "Please login to access this endpoint.",
                success: false,
                error: true
            });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(401).json({
                message: "User does not exist.",
                success: false,
                error: true
            });
        }

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

        // Generate Order ID
        const generateOrderId = () => {
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            const now = new Date();
            const year = now.getFullYear().toString().slice(-2);
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            return `ORD${randomNumber}${day}${month}${year}`;
        };

        const orderId = generateOrderId();

        const filteredItems = itemList.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity
        }));

        // Prepare line items
        const line_items = itemList.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.productId.name,
                    images: item.productId.image,
                    metadata: {
                        productId: item.productId._id
                    }
                },
                unit_amount: pricewithDiscount(item.productId.price, item.productId.discount) * 100,
            },
            adjustable_quantity: {
                enabled: false,
            },
            quantity: item.quantity
        }));

        // Add Other Charges as a line item if it's greater than 0
        if (otherCharge > 0) {
            line_items.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Other Charges",
                        description: "Additional charges including tips, donation, etc.",
                    },
                    unit_amount: otherCharge * 100, // Now it's correctly rounded
                },
                quantity: 1,
            });
        }

        const params = {
            submit_type: "pay",
            mode: "payment",
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: userId,
                addressId: delivery_address_id,
                totalAmt: totalAmt,
                filteredItems: JSON.stringify(filteredItems),
                orderId: orderId,
                subTotalAmt: subTotalAmt,
            },
            line_items: line_items,
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`
        };

        // Create a Checkout Session
        const session = await Stripe.checkout.sessions.create(params);

        return res.status(200).json(session)

        // // Create new order in DB (initially pending)
        // const newOrder = new OrderModel({
        //     userId,
        //     orderId,
        //     itemList: filteredItems,
        //     paymentId: session.id, // Use session ID for reference
        //     delivery_address: delivery_address_id,
        //     subTotalAmt,
        //     totalAmt,
        //     order_status: "Pending",
        //     invoice_receipt: ""
        // });

        // await newOrder.save();

        // return res.status(201).json({
        //     message: "Stripe payment initiated successfully",
        //     success: true,
        //     order: newOrder,
        //     sessionId: session.id
        // });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong",
            success: false
        });
    }
};

//Stripe webhook
//http://localhost:8080/api/order/webhook
export const stripeWebhookPayment = async (req, res) => {
    const event = req.body;
    // console.log("event: ", event);
    const endPointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object
            const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
            // console.log("lineItems: ", lineItems);
            // console.log("session: ", session);
            
            const userId = session.metadata.userId

            const newOrder = new OrderModel({
                userId: userId,
                orderId: session.metadata.orderId,
                itemList: JSON.parse(session.metadata.filteredItems),
                paymentId: session.payment_intent,
                delivery_address: session.metadata.addressId,
                subTotalAmt: session.metadata.subTotalAmt,
                totalAmt: session.metadata.totalAmt,
                order_status: "Pending", // Default status
                invoice_receipt: ""
            });

            console.log("newOrder: ", newOrder);

            await newOrder.save();
            
            if(newOrder) {
                await CartProductModel.deleteMany({userId})
                return res.status(201).json({
                    message: "Order placed successfully",
                    error: false,
                    success: true,
                    order: newOrder
                });
            } else {
                return res.status(500).json({
                    message: "Failed to place order",
                    error: true,
                    success: false
                });
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
}

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
            .populate("itemList.productId")
            .populate("delivery_address")
            .sort({ createdAt: -1 }); // Sorting by newest first
    

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

export const getAllOrdersController = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Please log in to access this endpoint.",
                success: false,
                error: true
            });
        }

        const user = await UserModel.findById(userId).lean();

        if (!user) {
            return res.status(401).json({
                message: "User does not exist.",
                success: false,
                error: true
            });
        }

        if (user.role.toLowerCase() !== "admin") {
            return res.status(403).json({
                message: "Only admins can access this endpoint.",
                success: false,
                error: true
            });
        }

        // Fetch all orders
        const orders = await OrderModel.find()
            .populate("userId", "name")
            .populate("itemList.productId")
            .populate("delivery_address")
            .sort({ createdAt: -1 }); // Sorting by newest first


        return res.status(200).json({
            message: "Orders fetched successfully.",
            success: true,
            orders
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({
            message: error.message || "Something went wrong",
            success: false
        });
    }
};

export const updateOrderStatusController = async (req, res) => {
    try {
        const userId = req.userId;
        const { orderId, order_status } = req.body;

        // Check if user is logged in
        if (!userId) {
            return res.status(401).json({
                message: "Please log in to access this endpoint.",
                success: false,
                error: true
            });
        }

        // Fetch user details
        const user = await UserModel.findById(userId).lean();
        if (!user) {
            return res.status(401).json({
                message: "User does not exist.",
                success: false,
                error: true
            });
        }

        // Only admin can update order status
        if (user.role.toLowerCase() !== "admin") {
            return res.status(403).json({
                message: "Only admins can access this endpoint.",
                success: false,
                error: true
            });
        }

        // Validate input
        if (!orderId || !order_status) {
            return res.status(400).json({
                message: "Missing orderId or order_status.",
                success: false,
                error: true
            });
        }

        // Check if the order exists
        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Order not found.",
                success: false,
                error: true
            });
        }

        // Update order status
        order.order_status = order_status;
        await order.save();

        return res.status(200).json({
            message: "Order status updated successfully.",
            success: true,
            updatedOrder: order
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({
            message: error.message || "Something went wrong",
            success: false
        });
    }
};