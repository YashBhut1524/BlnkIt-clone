/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext } from "react";
import { handleAddItem } from "../store/cartProductSlice";
import summaryApi from "../common/summaryApi";
import { useDispatch } from "react-redux";
import Axios from "../utils/Axios";
import { useEffect } from "react";
import AxiosToastError from "../utils/AxiosToastError";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const dispatch = useDispatch()

    const fetchCartItem = async () => {
        try {
            const response = await Axios({
                ...summaryApi.getCartItems,
            })
            // console.log("response: ", response);

            if (response.data.success) {
                dispatch(handleAddItem(response.data.data))
            }

        } catch (error) {
            console.log(error);
        }
    }

    const updateCartItem = async (id, quantity) => {
        try {
            const response = await Axios({
                ...summaryApi.updateCartItemQuantity,
                data: {
                    _id: id,
                    quantity
                }
            })

            if(response.data.success) {
                // toast.success(response.data.message);
                fetchCartItem()
                return response.data.data
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const deleteCartItem = async (id) => {
        try {
            await Axios({
                ...summaryApi.deleteItemFromCart,
                data: {
                    _id: id
                }
            })
            fetchCartItem()
        } catch (error) {
            AxiosToastError(error)
            
        }
    }

    useEffect(() => {
        fetchCartItem();
    }, []);

    return (
        <CartContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const userCart = () => useContext(CartContext)