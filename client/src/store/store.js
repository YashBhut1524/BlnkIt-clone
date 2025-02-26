import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice"
import productReducer from "./productSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        product: productReducer,
    },
})
