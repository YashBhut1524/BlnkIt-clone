import { createSlice } from "@reduxjs/toolkit"

const initialValues = {
    allCategory: [],
    subCategory: [],
    product: [],
}

const productSlice = createSlice({
    name: "product",
    initialState: initialValues,
    reducers: {
        setAllCategory: (state, action) => {
            state.allCategory = action.payload;
        }
    }
})

export const { 
    setAllCategory 
} = productSlice.actions

export default productSlice.reducer