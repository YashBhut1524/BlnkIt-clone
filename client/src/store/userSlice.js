import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: "",
    name: "",
    email: "",
    avatar: "",
    mobile: "",
    verify_email: "",
    address_details: [],
    last_login_date: "",
    status: "",
    shopping_cart: [],
    orderHistory: [],
    role: ""
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state._id = action.payload?._id
            state.name = action.payload?.name
            state.email = action.payload?.email
            state.avatar = action.payload?.avatar
            state.mobile = action.payload?.mobile
            state.verify_email = action.payload?.verify_email
            state.address_details = action.payload?.address_details
            state.last_login_date = action.payload?.last_login_date
            state.status = action.payload?.status
            state.shopping_cart = action.payload?.shopping_cart
            state.orderHistory = action.payload?.orderHistory
            state.role = action.payload?.role
        },
        updateAvatar : (state, action) => {
            state.avatar = action.payload
        },
        logout: (state) => {
            state._id = "";
            state.name = "";
            state.email = "";
            state.avatar = "";
            state.mobile = "";
            state.verify_email = "";
            state.address_details = [];
            state.last_login_date = "";
            state.status = "";
            state.shopping_cart = [];
            state.orderHistory = [];
            state.role = "";
        }
        
    }
})

export const { setUserDetails, updateAvatar, logout } = userSlice.actions

export default userSlice.reducer