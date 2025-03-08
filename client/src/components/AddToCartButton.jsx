/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { userCart } from '../provider/CartContext';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import summaryApi from '../common/summaryApi';
import { Minus, Plus } from "lucide-react";
function AddToCartButton({ data }) {

    const { fetchCartItem, updateCartItem, deleteCartItem } = userCart();
    const cartItem = useSelector(state => state.cartItem.cart)
    // console.log(cartItem);

    const [isItemAvailableInCart, setIsItemAvailableInCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemsDetails] = useState()

    //checking this item in cart or not
    useEffect(() => {
        const checkItemInCart = cartItem.some(item => item.productId._id === data._id)
        setIsItemAvailableInCart(checkItemInCart)

        const product = cartItem.find(item => item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemsDetails(product)
    }, [data, cartItem])

    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            const resposnse = await Axios({
                ...summaryApi.addToCart,
                data: {
                    productId: data?._id,
                },
            })
            // console.log("resposnse: ", resposnse);

            if (resposnse.data.success) {
                toast.success(resposnse.data.message)
                fetchCartItem()
            } else {
                toast.error(resposnse.data.message)
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }

    const increaseQuantity = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        updateCartItem(cartItemDetails?._id, cartItemDetails?.quantity + 1);
        // fetchCartItem()
    }

    const decreaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        if(qty === 1){
            deleteCartItem(cartItemDetails?._id)
            // fetchCartItem()
        }else{
            await updateCartItem(cartItemDetails?._id,qty-1)
        }
    }

    return (
        <>
            {isItemAvailableInCart ? (
                <div className={`w-full flex items-center font-bold text-md text-white 
                    ${data?.stock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#318616]"} 
                    rounded-lg`}>
                    <button
                        className="px-1 py-2 w-1/3 text-center cursor-pointer"
                        onClick={(e) => decreaseQty(e)}
                        disabled={data?.stock === 0}
                    >
                        <Minus size={16} />
                    </button>
                    <span className="p-1 w-1/3 text-center text-md">
                        {cartItemDetails?.quantity}
                    </span>
                    <button
                        className="p-1 w-1/3 text-center cursor-pointer"
                        onClick={(e) => increaseQuantity(e)}
                        disabled={data?.stock === 0}
                    >
                        <Plus size={16} />
                    </button>
                </div>
            ) : (
                <div className="rounded">
                    <button
                        className={`px-4 py-1 border-2 rounded-lg font-medium transition-all duration-200 
                            ${data?.stock === 0 
                            ? "border-gray-400 text-gray-400 cursor-not-allowed" 
                            : "text-[#318616] border-[#318616] hover:bg-[#318616] hover:text-white cursor-pointer"}`}
                        onClick={(e) => handleAddToCart(e)}
                        disabled={data?.stock === 0}
                    >
                        ADD
                    </button>
                </div>
            )}
        </>
    );
}

export default AddToCartButton