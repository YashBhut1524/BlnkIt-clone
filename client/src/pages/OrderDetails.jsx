import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import summaryApi from "../common/summaryApi";
import Axios from "../utils/Axios";
import { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoMdCopy } from "react-icons/io";

function OrderDetails() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [deliveryTime, setDeliveryTime] = useState(null);
    const [loading, setLoading] = useState(false);

    function formatUnit(unit) {
        return typeof unit === "number" || /^\d+$/.test(unit) ? `${unit} Unit` : unit;
    }

    function calculateDeliveryDate(createdAt, deliveryTime) {
        if (!createdAt || !deliveryTime) return "";
        const deliveryDate = new Date(createdAt);
        deliveryDate.setDate(deliveryDate.getDate() + deliveryTime);

        return deliveryDate.toLocaleString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    }

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...summaryApi.getOrderDetailsByOrderId,
                data: { orderId }
            });

            if (response.data.success) {
                setOrderData(response.data.order[0]);
            } else {
                toast.error(response.data.message);
                setOrderData(null);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
        console.log(orderData);
    }, []);

    // Set deliveryTime when orderData is updated
    useEffect(() => {
        if (orderData?.createdAt && orderData?.delivery_time) {
            setDeliveryTime(calculateDeliveryDate(orderData.createdAt, orderData.delivery_time));
        }
    }, [orderData]);

    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center mt-[25%]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-500"></div>
                </div>
            ) : (
                <div className="mx-3">
                    {/* Back Button */}
                    <button onClick={() => navigate(-1)} className="p-3 border border-gray-300 rounded-md">
                        <FaArrowLeftLong size={20} className="text-[#1F1F1F]" />
                    </button>
                    {/* Order summary */}
                    <div className="mt-5">
                        <p className="text-lg font-bold">Order summary</p>
                        {orderData?.order_status === "Delivered" && (
                            <p className="text-xs text-[#666666]">Arrived at {deliveryTime}</p>
                        )}
                        {(orderData?.order_status === "Pending" ||
                            orderData?.order_status === "Processing" ||
                            orderData?.order_status === "Shipped") && (
                                <p className="text-xs text-[#666666]">Your Order will arrive at {deliveryTime}</p>
                            )}
                        {(orderData?.order_status === "Cancelled" || orderData?.order_status === "Returned") && (
                            <p className="text-xs text-[#666666]">Order has been {orderData?.order_status}</p>
                        )}
                        <div className="px-4 mt-4">
                            {/* Items in order */}
                            <div>
                                <p>{orderData?.itemList.length} items in this order</p>
                                {/* Products */}
                                <div className="flex flex-col gap-3 mt-3">
                                    {
                                        orderData?.itemList.map((item, index) => (
                                            <div key={index} className="flex justify-between">
                                                <div className="flex gap-3 items-center">
                                                    <img src={item.productId.image[0]} alt="" className="w-15 h-15 p-1 border border-gray-300 rounded-xl" />
                                                    <div>
                                                        <p className="text-xs font-semibold line-clamp-1">{item.productId.name}</p>
                                                        <p className="text-xs text-[#666666]">
                                                            {formatUnit(item.productId.unit)} x {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-xs font-bold">
                                                    &#8377;{item.productId.price - (item.productId.price * item.productId.discount / 100)}
                                                </p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            {/* Breaking line */}
                            <div className="border-b-10 border-[#F5F5F5] mt-5">

                            </div>
                            {/* Bill Details */}
                            <div className="mt-5">
                                <p className="text-sm font-bold pb-5 border-b border-gray-100">Bill details</p>
                                <div className="space-y-2 mt-4">
                                    <div className="flex justify-between font-semibold">
                                        <p className="text-xs text-[#666666]">MRP</p>
                                        <p className="text-xs text-[#666666]">
                                            &#8377;{orderData?.subTotalAmt}
                                        </p>

                                    </div>
                                    <>
                                        {
                                            (Math.floor(orderData?.subTotalAmt * 100) - Math.floor(orderData?.totalAmt * 100)) / 100 > 0 && (
                                                <div className="flex justify-between font-semibold">
                                                    <p className="text-xs text-[#256FEF]">Product discount</p>
                                                    <p className="text-xs text-[#256FEF]">
                                                        -&#8377;{(4 + (Math.floor(orderData?.subTotalAmt * 100) - Math.floor(orderData?.totalAmt * 100)) / 100).toFixed(2)}
                                                    </p>
                                                </div>
                                            )
                                        }
                                    </>
                                    <div className="flex justify-between font-semibold">
                                        <p className="text-xs text-[#666666]">Item total</p>
                                        <p className="text-xs text-[#666666]">&#8377;{((Math.floor(orderData?.subTotalAmt * 100) - Math.floor(orderData?.totalAmt * 100)) / 100).toFixed(2) > 0 ? orderData?.subTotalAmt - ((Math.floor(orderData?.subTotalAmt * 100) - Math.floor(orderData?.totalAmt * 100)) / 100).toFixed(2) - 4 : orderData?.subTotalAmt}</p>
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                        <p className="text-xs text-[#666666]">Handling charge</p>
                                        <p className="text-xs text-[#666666]">+&#8377;4</p>
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                        <p className="text-xs text-[#666666]">Delivery charges</p>
                                        <p className="text-xs text-[#666666]">{orderData?.subTotalAmt < 500 ? (<span>&#8377;30</span>) : "FREE"}</p>
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                        <p className="text-xs text-[#666666]">Other <span>(Tip and Feeding india)</span></p>
                                        <p className="text-xs text-[#666666]">{orderData?.subTotalAmt < 500 ? orderData?.totalAmt - 30 - 4 - orderData?.subTotalAmt : <span>&#8377;0</span>}</p>
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                        <p className="text-sm">Bill total</p>
                                        <p className="text-sm ">&#8377;{orderData?.totalAmt}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Breaking line */}
                            <div className="border-b-10 border-[#F5F5F5] mt-5">

                            </div>
                            {/* Order details */}
                            <div className="mt-5">
                                <p className="text-sm font-bold pb-5 border-b border-gray-100">Order details</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <div>
                                        <p className="text-xs text-[#666666]">Order ID</p>
                                        <div className="flex gap-1 text-[#282727]">
                                            <p className="text-sm ">{orderData?.orderId}</p>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(orderData?.orderId);
                                                    toast.success("Order ID copied!");
                                                }}
                                                className="text-sm"
                                            >
                                                <IoMdCopy />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <div>
                                        <p className="text-xs text-[#666666]">Payment</p>
                                        <p className="text-sm text-[#282727]">{orderData?.orderId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default OrderDetails;
