import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { useEffect, useState } from "react";
import order_photo from "../assets/order_photo.webp";
import { format } from "date-fns";
import rightTick from "../assets/rightTick.avif"
import { GoArrowRight } from "react-icons/go";
import { FaRegClock } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { TbTruckReturn } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

function AllOrderAdmin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const changeDateFormat = (timestamp) => {
        return format(new Date(timestamp), "eee, dd MMM''yy, h:mm a");
    };

    const fetchOrders = async () => {
        setLoading(true)
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
        } finally {
            setLoading(false)
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
        <>
            <div className="hidden lg:block xl:block space-y-4 mt-10 pl-5 pr-15">
                {
                    loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        orders.length > 0 ? (
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
                                            className={`text-[0.7rem] text-white px-2 rounded-2xl cursor-pointer ${order.order_status === "Pending"
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
                                        <button 
                                            className="py-2 px-3 rounded-lg border border-gray-300 text-[#038C1F] text-xs cursor-pointer"
                                            onClick={() => navigate(`/dashboard/order-details/${order.orderId}`)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No orders found.</p>
                        )
                    )
                }
            </div>
            <div className="lg:hidden xl:hidden space-y-4 pt-10 bg-[#F4F6FB]">
                {
                    loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        orders.length > 0 ? (
                            orders.map((order, index) => (
                                <div key={index} className="flex flex-col justify-between gap-2 border border-gray-300 bg-white px-2 py-3 rounded-xl">
                                    {/* order details */}
                                    <div className="flex flex-col gap-2">
                                        {/* Top Section */}
                                        <div className="flex justify-between border-b border-gray-300 pb-4">
                                            <div className="flex gap-3 items-center">
                                                {
                                                    (order.order_status === "Pending" || order.order_status === "Processing" || order.order_status === "Shipped") && (
                                                        <>
                                                            <div className="bg-[#f9fbc2] p-3 rounded-lg">
                                                                <FaRegClock className="text-[#b3b906]" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className="text-md font-bold">Order is {order.order_status}</p>
                                                                <p className="text-xs text-[#666666]">
                                                                    &#8377;{order.totalAmt} <span className="font-extrabold text-md">&nbsp;·&nbsp;</span> {changeDateFormat(order.createdAt)}
                                                                </p>
                                                                <p className="text-sm font-semibold text-gray-600">
                                                                    Ordered by: <strong>{order.userId.name}</strong>
                                                                </p>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                {
                                                    order.order_status === "Delivered" && (
                                                        <>
                                                            <img src={rightTick} alt="" className="w-10 h-10" />
                                                            <div className="flex flex-col">
                                                                <p className="text-md font-bold">Arrived in {order.delivery_time} minutes</p>
                                                                <p className="text-xs text-[#666666]">
                                                                    &#8377;{order.totalAmt} <span className="font-extrabold text-md">&nbsp;·&nbsp;</span> {changeDateFormat(order.createdAt)}
                                                                </p>
                                                                <p className="text-sm font-semibold text-gray-600">
                                                                    Ordered by: <strong>{order.userId.name}</strong>
                                                                </p>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                {
                                                    order.order_status === "Cancelled" && (
                                                        <>
                                                            <div className="bg-[#fbc2c2] p-2 rounded-lg">
                                                                <MdOutlineCancel size={20} className="text-[#b90606]" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className="text-md font-bold">Order is <span className="text-red-500">{order.order_status}!</span></p>
                                                                <p className="text-xs text-[#666666]">
                                                                    &#8377;{order.totalAmt} <span className="font-extrabold text-md">&nbsp;·&nbsp;</span> {changeDateFormat(order.createdAt)}
                                                                </p>
                                                                <p className="text-sm font-semibold text-gray-600">
                                                                    Ordered by: <strong>{order.userId.name}</strong>
                                                                </p>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                {
                                                    order.order_status === "Returned" && (
                                                        <>
                                                            <div className="bg-[#d9c2fb] p-2 rounded-lg">
                                                                <TbTruckReturn size={25} className="text-[#6806b9]" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className="text-md font-bold">Order is {order.order_status}</p>
                                                                <p className="text-xs text-[#666666]">
                                                                    &#8377;{order.totalAmt} <span className="font-extrabold text-md">&nbsp;·&nbsp;</span> {changeDateFormat(order.createdAt)}
                                                                </p>
                                                                <p className="text-sm font-semibold text-gray-600">
                                                                    Ordered by: <strong>{order.userId.name}</strong>
                                                                </p>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <button
                                                onClick={() => navigate(`/dashboard/order-details/${order.orderId}`)}
                                            >
                                                <GoArrowRight />
                                            </button>
                                        </div>
                                        <div className="w-[20%]">
                                            {/* Order status dropdown */}
                                            <select
                                                value={order.order_status}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                className={`text-[0.7rem] text-white px-2 rounded-2xl cursor-pointer ${order.order_status === "Pending"
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
                                        {/* Bottom Section */}
                                        <div className="flex gap-2 overflow-x-scroll ">
                                            {
                                                order.itemList.map((item, index) => (
                                                    <img
                                                        src={item.productId.image[0]}
                                                        alt={item.productId.name}
                                                        key={index}
                                                        className="w-20 h-20 px-1 py-2 border border-gray-300 rounded-lg"
                                                    />
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No orders found.</p>
                        )
                    )
                }
            </div>
        </>
    );
}

export default AllOrderAdmin;