import { createSlice } from "@reduxjs/toolkit"

const initialValues = {
    allCategory: [],
    allsubCategory: [],
    product: [],
}

const productSlice = createSlice({
    name: "product",
    initialState: initialValues,
    reducers: {
        setAllCategory: (state, action) => {
            state.allCategory = action.payload;
        },
        setAllSubCategory: (state, action) => {
            state.allSubCategory = action.payload;
        }
    }
})

export const { 
    setAllCategory,
    setAllSubCategory
} = productSlice.actions

export default productSlice.reducer