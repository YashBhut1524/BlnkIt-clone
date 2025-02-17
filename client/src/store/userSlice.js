import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: "",
    name: "",
    email: "",
}

const userSilce = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state = {...action.payload}
        }
    }
})

export const { setUserDetails } = userSilce.actions

export default userSilce.reducer