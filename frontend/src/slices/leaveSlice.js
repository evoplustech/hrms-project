import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    status: 'idel',
    error: null
}

const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers:{},
    extraReducers: (builer) => {
        // builer.addCase();
    }

})

export default leaveSlice.reducer