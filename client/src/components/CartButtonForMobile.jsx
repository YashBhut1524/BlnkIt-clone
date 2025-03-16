/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useSelector } from "react-redux";
import { FaCaretRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function CartButtonForMobile({setIsCartButtonForMobile, isCartMenuOpen}) {

    const cartItem = useSelector((state) => state.cartItem.cart);
    const navigate = useNavigate();

    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        let itemsCount = 0;
        let priceCount = 0;

        // for (const item of cartItem) {
        //     itemsCount += item.quantity;
        //     const discountedPrice = item.productId.price * (1 - item.productId.discount / 100);
        //     priceCount += discountedPrice * item.quantity;
        // }
        itemsCount = cartItem.reduce((prev, curr) => {
            return prev + curr.quantity;
        }, 0)
        priceCount = parseFloat(cartItem.reduce((prev, curr) => {
            return prev + curr.productId.price * (1 - curr.productId.discount / 100) * curr.quantity;
        }, 0).toFixed(2));

        setTotalItems(itemsCount);
        setTotalPrice(priceCount);
    }, [cartItem]);
    return (

        <div className={`bg-[#318616] flex fixed lg:hidden xl:hidden left-0 right-0 bottom-0 z-50 h-[9vh] rounded-xl mx-4 mb-4 justify-between items-center px-2 ${isCartMenuOpen? "hidden" : ""}`}>
            {/* Cart Logo, number of items and total price */}
            <div className="flex gap-2">
                <button className="p-2 bg-[#379646] z-20 text-white rounded-lg">
                    <HiOutlineShoppingCart size={22}/>
                </button>
                <div className="flex flex-col text-white font-semibold">
                    <span className="text-xs font-semibold">{totalItems} items</span>
                    <span className="text-md font-bold">&#8377; {totalPrice}</span>
                </div>
            </div>
            {/* View Cart */}
            <div 
                className="flex items-center text-white cursor-pointer"
                onClick={() => {
                    navigate("/cart")
                    setIsCartButtonForMobile(false)
                }}
            >
                <span>View Cart</span>
                <FaCaretRight size={15} className="mt-1"/>
            </div>
        </div>
    )
}

export default CartButtonForMobile
