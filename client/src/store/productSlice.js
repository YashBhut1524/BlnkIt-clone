import { createSlice } from "@reduxjs/toolkit"

const initialValues = {
    allCategory: [],
    loadingCategory: false,
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
        setLoadingCategory: (state, action) => {
            state.loadingCategory = action.payload;
        },
        setAllSubCategory: (state, action) => {
            state.allSubCategory = action.payload;
        },
    }
})

export const { 
    setAllCategory,
    setLoadingCategory,
    setAllSubCategory
} = productSlice.actions

export default productSlice.reducer