import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        required: [true, "Provide orderId"],
        unique: true
    },
    itemList: [
        {
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: "product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    paymentId: {
        type: String,
        default: ""
    },
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: 'address',
        required: true
    },
    subTotalAmt: {
        type: Number,
        default: 0
    },
    totalAmt: {
        type: Number,
        default: 0
    },
    order_status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
        default: "Pending"
    },
    invoice_receipt: {
        type: String,
        default: ""
    },
    delivery_time: {
        type: Number,
    }
}, {
    timestamps: true
});

const OrderModel = mongoose.model('order', orderSchema);

export default OrderModel;
