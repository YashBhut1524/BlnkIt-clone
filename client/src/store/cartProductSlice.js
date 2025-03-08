import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cart: []
}

const cartSlice = createSlice({
    name: "cartItem",
    initialState: initialState,
    reducers: {
        handleAddItem: (state, action) => {
            state.cart = [...action.payload]
        }
    }
})

export const {handleAddItem} = cartSlice.actions
export default cartSlice.reducer