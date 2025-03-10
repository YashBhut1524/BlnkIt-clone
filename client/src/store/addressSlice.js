import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    addresses: [], // Storing multiple addresses
};

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        setAddresses: (state, action) => {
            state.addresses = action.payload; // Set all addresses (useful on first load)
        },
    }
});

export const { setAddresses, addAddress, updateAddress, deleteAddress } = addressSlice.actions;
export default addressSlice.reducer;
