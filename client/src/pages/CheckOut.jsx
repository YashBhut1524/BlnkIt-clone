import { useState } from "react";
import { useAddress } from "../provider/AddressContext";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import toast from "react-hot-toast"
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";

function CheckOut() {

    const { addresses } = useAddress()

    const navigate = useNavigate();
    const location = useLocation();
    const { grandTotal, totalItems, totalPriceWithOutDiscount } = location.state || {};

    const cartItem = useSelector((state) => state.cartItem.cart);
    // console.log("cartItem", cartItem);

    const defaultAddress = addresses.find((address) => address.defaultAddress === true)

    const [optionOpen, setOptionOpen] = useState("")
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
    const [isConfirmationScreenActive, setIsConfirmationScreenActive] = useState("")
    const [loading, setLoading] = useState(false)

    const handlePayNow = async () => {
        setLoading(true)
        if (selectedPaymentMethod === "cash") {

            // const data = {
            //     itemList: cartItem,
            //     totalAmt: grandTotal,
            //     subTotalAmt: totalPriceWithOutDiscount,
            //     delivery_address_id: defaultAddress._id,
            // }
            // console.log(data);

            try {
                const response = await Axios({
                    ...summaryApi.createCODOrder,
                    data: {
                        itemList: cartItem,
                        totalAmt: grandTotal,
                        subTotalAmt: totalPriceWithOutDiscount,
                        delivery_address_id: defaultAddress._id,
                    }
                })

                if (response.data.success) {
                    toast.success(response.data.message)
                    navigate("/dashboard/my-orders")
                } else {
                    toast.error(response.data.message)
                }

            } catch (error) {
                // console.log(error);
                toast.error(error)
            } finally {
                setIsConfirmationScreenActive(false)
                setLoading(false)
            }
        }
    }

    return (
        <>
            <div className="flex justify-between min-h-[90vh] w-screen lg:w-full xl:w-full lg:max-w-[1100px] xl:max-w-[1100px] mx-auto select-none  py-8 lg:p-8 xl:p-8 ">
                {/* Left Section - Payment Methods */}
                <div className="w-screen lg:w-2/3 xl:w-2/3 p-6 rounded-lg bg-white">
                    <h2 className="text-lg lg:text-2xl xl:text-2xl font-semibold mb-4">Select Payment Method</h2>
                    <div>
                        {/* Method */}
                        <div className="py-5 px-6 rounded-t-lg overflow-y-auto border border-gray-200">
                            <div className="flex justify-between cursor-pointer"
                                onClick={() => {
                                    setOptionOpen(optionOpen === "cash" ? "" : "cash");
                                    setSelectedPaymentMethod(optionOpen === "cash" ? "" : "cash");
                                }}
                            >
                                <p className="text-2xl text-[#1C1C1C]">Cash</p>
                                <button>
                                    {
                                        optionOpen === "cash" ? <FaAngleUp size={20} /> : <FaAngleDown size={20} />
                                    }
                                </button>
                            </div>
                            {/* open COD section*/}
                            {
                                optionOpen === "cash" && (
                                    <div className="mt-10 font-semibold text-gray-600">
                                        Please keep exact change handy to help us serve you better
                                    </div>
                                )
                            }
                        </div>
                        <div className="py-5 px-6 overflow-y-auto border border-gray-200">
                            <div className="flex justify-between cursor-pointer"
                                onClick={() => {
                                    setOptionOpen(optionOpen === "stripe" ? "" : "stripe");
                                    setSelectedPaymentMethod(optionOpen === "stripe" ? "" : "stripe");
                                }}
                            >
                                <p className="text-2xl text-[#1C1C1C]">Stripe</p>
                                <button>
                                    {
                                        optionOpen === "stripe" ? <FaAngleUp size={20} /> : <FaAngleDown size={20} />
                                    }
                                </button>
                            </div>
                            {/* open COD section*/}
                            {
                                optionOpen === "stripe" && (
                                    <div className="mt-10 font-semibold text-gray-600">
                                        Please keep exact change handy to help us serve you better
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>


                {/* Right Section - Cart Summary */}
                <div className="hidden lg:block xl:block w-1/3 bg-white h-[80vh] py-5 border border-gray-200">
                    {/* address */}
                    <div className="px-6 pb-5">
                        <h3 className="text-xl text-[#676767] font-semibold">Delivery Address</h3>
                        <p className="text-sm text-gray-400">
                            <span className="font-semibold">{defaultAddress?.saveAs}: </span>
                            <span>{[defaultAddress?.street, defaultAddress?.flatHouseNumber, defaultAddress?.floor, defaultAddress?.landmark, `${defaultAddress?.city}-${defaultAddress?.pincode}`].filter(Boolean).join(", ")}
                            </span>
                        </p>
                    </div>
                    {/* Items */}
                    <div className="bg-[#FBFBFB] flex justify-between px-6 py-5 border border-gray-200">
                        <p className="text-[#676767] font-bold text-sm">My Chart</p>
                        <p className="text-[#676767] font-semibold text-sm">{totalItems} Items</p>
                    </div>
                    <div className="h-[50vh] overflow-y-auto">
                        {
                            cartItem.map((item, index) => (
                                <div key={index} className="px-7 py-5 border border-gray-200 flex items-center gap-5">
                                    <p>{item.quantity}</p>
                                    <img src={item.productId.image[0]} alt="" className="w-15 h-15" />
                                    <div className="text-xs flex flex-col gap-1">
                                        <p className="line-clamp-1">{item.productId.name}</p>
                                        <div>
                                            <p>{item.productId.unit}</p>
                                            {
                                                item?.productId.discount > 0 ? (
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[11px] font-bold line-through text-gray-500">
                                                            &#8377;{item?.productId.price}
                                                        </span>
                                                        <span className="text-[11px] font-bold text-gray-700">
                                                            &#8377;{(item?.productId.price - (item?.productId.price * item?.productId.discount / 100)).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] font-bold text-gray-700">&#8377;{item?.productId.price}</span>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <button
                        className={`w-full text-white py-3 text-lg font-bold rounded-lg ${selectedPaymentMethod === ""
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#4A842C] cursor-pointer"
                            }`}
                        disabled={selectedPaymentMethod === ""}
                        onClick={() => setIsConfirmationScreenActive(true)}
                    >
                        Pay Now
                    </button>
                </div>
            </div>
            <button
                className={`w-full fixed lg:hidden xl:hidden bottom-0 text-white py-3 text-lg font-bold ${selectedPaymentMethod === ""
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#4A842C] cursor-pointer"
                    }`}
                disabled={selectedPaymentMethod === ""}
                onClick={() => setIsConfirmationScreenActive(true)}
            >
                Pay Now
            </button>

            {isConfirmationScreenActive && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
                    {loading ? (
                        // Loader
                        <div className="flex items-center justify-center bg-white p-6 rounded-lg shadow-lg w-40 h-28">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-500"></div>
                        </div>
                    ) : (
                        // Confirmation Modal
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
                            <h2 className="text-lg font-semibold mb-3 text-gray-800">
                                Confirm Your Order
                            </h2>
                            <p className="text-gray-600 mb-5">
                                Ready to place your order?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setIsConfirmationScreenActive(false)}
                                    className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePayNow}
                                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
                                >
                                    Confirm Order
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </>
    );
}

export default CheckOut;
