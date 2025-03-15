import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { useEffect, useState } from "react";
import order_photo from "../assets/order_photo.webp";
import { format } from "date-fns";

function AllOrderAdmin() {
    const [orders, setOrders] = useState([]);

    const changeDateFormat = (timestamp) => {
        return format(new Date(timestamp), "eee, dd MMM''yy, h:mm a");
    };

    const fetchOrders = async () => {
        try {
            const response = await Axios(summaryApi.getAllOrdersAdmin);
            if (response.data.success) {
                // toast.success(response.data.message);
                setOrders(response.data.orders || []);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message || "Failed to fetch orders");
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await Axios({
                ...summaryApi.updateOrderStatusAdmin,
                data: {
                    orderId,
                    order_status: newStatus,
                }
            })
            
            if (response.data.success) {
                toast.success("Order status updated!");
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, order_status: newStatus } : order
                    )
                );
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message || "Failed to update order status");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="space-y-4 mt-10 pl-5 pr-15">
            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <div
                        key={index}
                        className="flex justify-between gap-2 pb-5 border-b border-gray-300 transform  transition-transform duration-200 ease-in-out hover:scale-105"
                    >
                        {/* Order details */}
                        <div className="flex gap-2 items-center">
                            <img src={order_photo} alt="" />
                            <div className="flex flex-col">
                                <p className="text-sm font-bold">
                                    {order.orderId} &nbsp;·&nbsp; &#8377;{order.totalAmt}
                                </p>
                                <p className="text-sm font-semibold text-gray-600">
                                    Ordered by: <strong>{order.userId.name}</strong>
                                </p>
                                <p className="text-xs text-[#666666]">Placed on {changeDateFormat(order.createdAt)}</p>
                            </div>
                            {/* Order status dropdown */}
                            <select
                                value={order.order_status}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                className={`text-[0.7rem] text-white px-2 rounded-2xl cursor-pointer ${
                                    order.order_status === "Pending"
                                        ? "bg-yellow-500"
                                        : order.order_status === "Processing"
                                        ? "bg-blue-500"
                                        : order.order_status === "Shipped"
                                        ? "bg-purple-500"
                                        : order.order_status === "Delivered"
                                        ? "bg-green-500"
                                        : order.order_status === "Cancelled"
                                        ? "bg-red-500"
                                        : order.order_status === "Returned"
                                        ? "bg-gray-500"
                                        : "bg-gray-600"
                                }`}
                            >
                                {["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"].map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <button className="py-2 px-3 rounded-lg border border-gray-300 text-[#038C1F] text-xs cursor-pointer">
                                View Details
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
}

export default AllOrderAdmin;
