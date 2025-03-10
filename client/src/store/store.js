import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartProductSlice";
import addressReducer from "./addressSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        product: productReducer,
        cartItem: cartReducer,
        address: addressReducer, 
    },
});
