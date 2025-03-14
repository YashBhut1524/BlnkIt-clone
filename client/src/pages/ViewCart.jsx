/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import clock from "../assets/clock.png"
import { useSelector } from "react-redux";
import { IoMdListBox } from "react-icons/io";
import { GiScooter } from "react-icons/gi";
import { HiShoppingBag } from "react-icons/hi";
import waves from "../assets/waves.svg"
import feeding_india_icon_v6 from "../assets/feeding_india_icon_v6.webp"
import empty_cart from "../assets/empty_cart.webp"
import { userCart } from "../provider/CartContext";
import AddToCartButton from "../components/AddToCartButton";
import { FaChevronRight } from "react-icons/fa6";
import { useAddress } from "../provider/AddressContext";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
function ViewCart() {

    const capitalizeFirstLetter = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const navigate = useNavigate()
    
    const { addresses } = useAddress();
    // console.log(addresses);
    const defaultAddress = addresses.find(address => address.defaultAddress) || addresses[0];

    const [loading, setLoading] = useState(false);
    const cartItem = useSelector((state) => state.cartItem.cart);
    const [totalPriceWithDiscount, setTotalPriceWithDiscount] = useState(0);
    const [totalPriceWithOutDiscount, setTotalPriceWithOutDiscount] = useState(0);
    const [totalSavings, setTotalSavings] = useState(0);
    const [deliveryCharge, setDeliveryCharge] = useState(30);
    const [isDonationChecked, setIsDonationChecked] = useState(false);
    const [isCustomTipSelected, setIsCustomTipSelected] = useState(false);
    const [tipAmount, setTipAmount] = useState(0);
    const [clickAddTip, setClickAddTip] = useState(false);
    const [custonTipInput, setCustonTipInput] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const grandTotal = totalPriceWithDiscount + 4 + (isDonationChecked ? 1 : 0) + tipAmount;


    const { fetchCartItem } = userCart()

    useEffect(() => {
        fetchCartItem()
    }, []);

    useEffect(() => {
        let itemsCount = 0;
        let priceCountWithDiscount = 0;
        let priceCountWithOutDiscount = 0;

        itemsCount = cartItem.reduce((prev, curr) => prev + curr.quantity, 0);

        priceCountWithDiscount = parseFloat(
            cartItem.reduce((prev, curr) =>
                prev + curr.productId.price * (1 - curr.productId.discount / 100) * curr.quantity, 0
            ).toFixed(2)
        );

        priceCountWithOutDiscount = parseFloat(
            cartItem.reduce((prev, curr) =>
                prev + curr.productId.price * curr.quantity, 0
            ).toFixed(2)
        );

        setTotalItems(itemsCount);
        setTotalPriceWithDiscount(priceCountWithDiscount);
        setTotalPriceWithOutDiscount(priceCountWithOutDiscount);
        setTotalSavings((totalPriceWithOutDiscount - totalPriceWithDiscount).toFixed(2));
        if (totalPriceWithDiscount > 500) {
            setDeliveryCharge(0);
        }
    }, [cartItem]);


    return (
        <div className="w-[98vw] overflow-x-hidden pt-10 bg-[#F5F7FD] shadow-lg overflow-y-scroll">
            {/* Sticky Cart Header */}
            <div className="sticky top-0 bg-white flex justify-between z-50">
                <h2 className="text-md font-bold mb-1 p-4">My Cart</h2>
                <button
                    className="absolute top-4 right-4 text-xl font-bold"
                    onClick={() => {
                        navigate("/")
                    }}
                >
                    ✕
                </button>
            </div>
            {loading ? (
                <>
                    <div className="space-y-4 animate-pulse p-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        <div className="h-32 bg-gray-200 rounded mt-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-gray-200 h-10 rounded"></div>
                </>
            ) : (
                <>
                    {
                        Object.keys(cartItem).length !== 0 ? (
                            <div className="bg-[#F5F7FD] h-full w-full p-4">

                                {/* Total Savings */}
                                <div className="bg-[#DBE8FF] p-3 text-sm text-blue-500 flex items-center justify-between rounded-2xl">
                                    <span className="font-semibold">Your total savings</span>
                                    <span className="font-bold">&#8377;{totalSavings}</span>
                                </div>

                                {/* Clock & Products */}
                                <div className="w-full bg-white mt-2 rounded-xl">
                                    {/* Clock */}
                                    <div className="p-3 flex gap-2 items-center">
                                        <img src={clock} alt="" className="w-12 h-12 bg-[#F8F8F8] object-cover rounded-xl" />
                                        <div className="flex flex-col">
                                            <span className="text-md font-bold text-black">Free delivery in 8 minutes</span>
                                            <span className="text-xs text-gray-500">Shipment of 5 items</span>
                                        </div>
                                    </div>
                                    {/* Products */}
                                    <div className="p-4 flex flex-col gap-4">
                                        {
                                            cartItem.map((item, index) => (
                                                <div className="flex justify-between" key={index}>
                                                    <div className="flex gap-2">
                                                        <img
                                                            src={item?.productId?.image[0]}
                                                            alt={item?.productId?.name}
                                                            className="w-18 h-18 p-1 border-1 border-gray-200 rounded-xl"
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm line-clamp-2">{item?.productId?.name}</span>
                                                            <span className="text-xs">{item?.productId?.unit}</span>
                                                            {
                                                                item?.productId.discount > 0 ? (
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-[11px] font-bold line-through text-gray-500">
                                                                            &#8377;{item?.productId.price}
                                                                        </span>
                                                                        <span className="text-[11px] font-bold text-black">
                                                                            &#8377;{(item?.productId.price - (item?.productId.price * item?.productId.discount / 100)).toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-[11px] font-bold">&#8377;{item?.productId.price}</span>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <AddToCartButton data={item?.productId} />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                                {/* Bill Details */}
                                <div className="w-full bg-white mt-3 rounded-xl ">
                                    <div className="flex flex-col gap-1 px-3">
                                        <span className="font-bold text-md">Bill details</span>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1">
                                                <IoMdListBox />
                                                <span className="text-xs">Items total</span>
                                                {
                                                    totalSavings > 0 && (
                                                        <div className="px-1 font-semibold rounded-md bg-[#DBE8FF] text-blue-500 text-[0.6rem]">
                                                            <span>Saved &#8377;{totalSavings}</span>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className="flex gap-1 text-xs">
                                                {cartItem.some(item => item.productId.discount > 0) && (
                                                    <span className="text-gray-700 line-through">&#8377;{totalPriceWithOutDiscount}</span>
                                                )}
                                                <span className="font-semibold">&#8377;{totalPriceWithDiscount}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1">
                                                <GiScooter />
                                                <span className="text-xs">Delivery charge</span>
                                            </div>
                                            <div>
                                                {deliveryCharge === 0 ? (
                                                    <div className="text-sm flex gap-1">
                                                        <span className="line-through text-gray-700">&#8377;30</span>
                                                        <span className="text-blue-500">FREE</span>
                                                    </div>
                                                ) : (
                                                    <span>&#8377;{deliveryCharge}</span>
                                                )}

                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1">
                                                <HiShoppingBag />
                                                <span className="text-xs">Handling charge</span>
                                            </div>
                                            <span className="text-xs">&#8377;4</span>
                                        </div>
                                    </div>
                                    {/* Grand total */}
                                    <div className="mt-2 flex justify-between items-center pb-5 px-3">
                                        <span className="text-sm font-semibold">Grand total</span>
                                        <span className="text-sm font-semibold">&#8377;{grandTotal}</span>
                                    </div>
                                    {/* Waves and total saving */}
                                    <div className="-mt-4 flex flex-col gap-0">
                                        <img src={waves} alt="" />
                                        <div className="flex justify-between items-center w-full bg-[#DBE8FF] px-3 pb-3 text-sm pt-1 text-blue-500 rounded-b-xl">
                                            <span>Your total savings</span>
                                            <span>&#8377;{totalSavings}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Feeding India donation */}
                                <div className="w-full bg-white mt-3 rounded-xl flex justify-between items-center p-4">
                                    <div className="flex gap-2 items-center">
                                        <img src={feeding_india_icon_v6} alt="" className="w-13 h-10" />
                                        <div className="flex flex-col">
                                            <span className="text-md font-bold">Feeding India donation</span>
                                            <span className="text-xs">Working towards a malnutrition free India. Feeding India...read more</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <span className="text-xs font-semibold">&#8377;1</span>
                                        <input
                                            type="checkbox"
                                            className="donation-checkbox"
                                            checked={isDonationChecked}
                                            onChange={() => setIsDonationChecked(!isDonationChecked)}
                                        />
                                    </div>
                                </div>

                                {/* Tip */}
                                <div className="w-full bg-white mt-3 rounded-xl p-2">
                                    <div className="flex">
                                        <div>
                                            <p className="text-md font-bold">Tip your delivery partner</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Your kindness means a lot! 100% of your tip will go directly to your delivery partner.
                                            </p>
                                        </div>
                                        {
                                            tipAmount > 0 && (
                                                <div className="flex flex-col gap-0">
                                                    <span className="text-[0.7rem]">&#8377;{tipAmount}</span>
                                                    <button
                                                        className="text-xs text-green-700 cursor-pointer"
                                                        onClick={() => setTipAmount(0)}
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>

                                    {/* Tip Options */}
                                    <div className="flex gap-2 mt-3 px-3">
                                        {
                                            isCustomTipSelected ? (
                                                <div className=" flex gap-2 items-center">
                                                    <button
                                                        className="flex items-center gap-1 px-1 py-2 bg-[#E8F5E9] rounded-xl text-sm font-semibold cursor-pointer border-1 border-green-700"
                                                        onClick={() => setIsCustomTipSelected(!isCustomTipSelected)}
                                                    >
                                                        👏 Custom
                                                    </button>
                                                    <div className="flex flex-col gap-1">
                                                        <input
                                                            type="number"
                                                            className="border-b border-gray-400 focus:border-black focus:outline-none px-2 py-1"
                                                            onChange={(e) => {
                                                                setClickAddTip(false)
                                                                setCustonTipInput(Number(e.target.value))
                                                            }}
                                                        />
                                                        {
                                                            custonTipInput < 10 && (
                                                                <p className="text-[0.6rem] text-red-500">Tip amount should be greater than &#8377;10</p>
                                                            )
                                                        }
                                                    </div>
                                                    {
                                                        !clickAddTip && (
                                                            <button
                                                                className="text-green-700 cursor-pointer"
                                                                onClick={() => {
                                                                    setTipAmount(custonTipInput)
                                                                    setClickAddTip(true)
                                                                    setIsCustomTipSelected(!isCustomTipSelected)
                                                                }}
                                                            >
                                                                add
                                                            </button>
                                                        )
                                                    }
                                                    {
                                                        clickAddTip && (
                                                            <button
                                                                className="text-gray-500"
                                                                onClick={() => setIsCustomTipSelected(!isCustomTipSelected)}
                                                            >
                                                                close
                                                            </button>
                                                        )
                                                    }

                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        className={`flex items-center gap-1 px-2 py-3  rounded-xl text-sm font-semibold cursor-pointer ${tipAmount === 20 ? 'border-1 border-green-700 bg-[#E8F5E9]' : ' border-1 border-gray-300'}`}
                                                        onClick={() => setTipAmount(20)}
                                                    >
                                                        😀 ₹20
                                                    </button>
                                                    <button
                                                        className={`flex items-center gap-1 px-2 py-3  rounded-xl text-sm font-semibold cursor-pointer ${tipAmount === 30 ? 'border-1 border-green-700 bg-[#E8F5E9]' : ' border-1 border-gray-300'}`}
                                                        onClick={() => setTipAmount(30)}
                                                    >
                                                        🤩 ₹30
                                                    </button>
                                                    <button
                                                        className={`flex items-center gap-1 px-2 py-3  rounded-xl text-sm font-semibold cursor-pointer ${tipAmount === 50 ? 'border-1 border-green-700 bg-[#E8F5E9]' : ' border-1 border-gray-300'}`}
                                                        onClick={() => setTipAmount(50)}
                                                    >
                                                        😍 ₹50
                                                    </button>
                                                    <button
                                                        className={`flex items-center gap-1 px-2 py-3 rounded-xl text-sm font-semibold cursor-pointer ${tipAmount !== 50 && tipAmount !== 30 && tipAmount !== 20
                                                                ? 'border-1 border-green-700 bg-[#E8F5E9]'
                                                                : 'border-1 border-gray-300'
                                                            }`}
                                                        onClick={() => setIsCustomTipSelected(!isCustomTipSelected)}
                                                    >
                                                        👏 Custom
                                                    </button>
                                                </>
                                            )
                                        }
                                    </div>
                                </div>

                                {/* Cancellation Policy */}
                                <div className="w-full bg-white mt-5 rounded-xl">
                                    <div className="flex flex-col px-3 py-2">
                                        <p className="text-md font-bold">Cancellation Policy</p>
                                        <p className="text-xs text-gray-500 mt-2">Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.</p>
                                    </div>
                                </div>

                                {/* empty space */}
                                <div className="pb-30">

                                </div>

                                {/* Checkout Button */}
                                <div className="fixed bottom-0 right-0 bg-white px-4 py-5 shadow-lg border border-gray-300 w-screen mt-3 rounded-xl">
                                    {/* Addresses*/}
                                    <div>
                                        {
                                            addresses.length === 0 ? (
                                                <div>
                                                </div>
                                            ) : (
                                                <div className=" pb-5 mb-3 border-b border-gray-500 rounded-t-xl flex justify-between items-center">
                                                    <div className="flex gap-2">
                                                        <CiLocationOn size={25} />
                                                        <div className="flex flex-col">
                                                            <p className="text-sm font-semibold">Delivering to {capitalizeFirstLetter(defaultAddress.saveAs)}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {[defaultAddress?.street, defaultAddress?.flatHouseNumber, defaultAddress?.floor, defaultAddress?.landmark, `${defaultAddress?.city}-${defaultAddress?.pincode}`]
                                                                    .filter(Boolean)
                                                                    .join(", ")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="text-sm text-[#0C831F] font-semibold"
                                                        onClick={() => {
                                                            navigate("/dashboard/addresses")
                                                        }}
                                                    >
                                                        Change
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="flex justify-center text-white bg-[#0C831F] px-2 py-4 rounded-xl">
                                        <button
                                            className="flex items-center gap-1 cursor-pointer"
                                            onClick={() => {
                                                if(addresses.length > 0) {
                                                    navigate("/checkout", { state: { grandTotal, totalItems, totalPriceWithOutDiscount } })
                                                } else {
                                                    navigate("/dashboard/addresses")
                                                    toast.error("Please add your address")
                                                }
                                            }}
                                        >
                                            <span>Add payment method</span>
                                            <FaChevronRight />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full bg-white">
                                <img src={empty_cart} alt="" />
                                <h1 className="text-center text-4xl font-bold">Empty Cart</h1>
                            </div>
                        )
                    }
                    {/* Cart items */}
                </>
            )}
        </div>
    )
}

export default ViewCart