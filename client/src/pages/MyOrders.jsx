import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { useEffect, useState } from "react";
import order_photo from "../assets/order_photo.webp"
import { format } from "date-fns";

function MyOrders() {
    const [orders, setOrders] = useState([]); // ✅ Fix: Initialize as an array

    const changeDateFormat = (timestamp) => {
        const formattedDate = format(new Date(timestamp), "eee, dd MMM''yy, h:mm a");
        // console.log(formattedDate); // Output: "Thu, 26 Dec'24, 6:19 PM"
        return formattedDate;
    }

    const fetchOrders = async () => {
        try {
            const response = await Axios(
                summaryApi.getOrders
            );
            console.log("response: ", response);

            if (response.data.success) {
                toast.success(response.data.message);
                setOrders(response.data.orders || []);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error(error.message || "Failed to fetch orders");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="space-y-4 mt-10 pl-5 pr-15">
            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <div key={index} className="flex justify-between gap-2 pb-5 border-b border-gray-300">
                        {/* order details */}
                        <div className="flex gap-2 items-center">
                            <img src={order_photo} alt="" />
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-bold">
                                    {order.orderId} &nbsp;·&nbsp; &#8377;{order.totalAmt}
                                </p>
                                <p className="text-xs text-[#666666]">Placed on {changeDateFormat(order.createdAt)}</p>
                            </div>
                            {/* order status */}
                            <p
                                className={`text-[0.7rem] text-white px-2 rounded-2xl ${
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
                                {order.order_status}
                            </p>

                        </div>
                        <div>
                            <button className="py-2 px-3 rounded-lg border border-gray-300 text-[#038C1F] text-xs">
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

export default MyOrders;
