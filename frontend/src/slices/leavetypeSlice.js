import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import httpRequest from "../../utils/httpRequest";


export const getLeaveTypes = createAsyncThunk ('getLeaveTypes', async () => {
    try {
        const response = await httpRequest ({ path: '/api/leaves/getleavetypes', method:'get', data:{} });
        return response;
    } catch (error) {
        console.log(`Error in the Get Leave Type function in the leaveSlice file ::  ${error.message}`);
        throw error;
    }
})

const initialState = {
    data: [],
    status: 'idel',
    error: null
}

const leavetypeSlice = createSlice({
    name: 'leaveType',
    initialState,
    extraReducers: (builder) => {
        builder.addCase( getLeaveTypes.pending, ( state ) => {
            state.status = 'pending';
        }).addCase(getLeaveTypes.fulfilled, ( state,action ) => {
            state.status = 'fulfilled';
            if(action.payload.success){
                state.data = action.payload.data
            }else{
                state.status = "error";
                state.error = action.payload?.error || action.payload?.message;
            }
        }).addCase( getLeaveTypes.rejected, ( state, action ) => {
            state.status    = 'rejected';
            state.error     = action.payload?.error || action.payload?.message;
        })
    }
})

export default leavetypeSlice.reducer


