import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const fetchLeaves = createAsyncThunk('fetchLeaves', async(searchParams)=>{
    try {
        const response = await httpRequest({ path:'/api/leaves/getleavedetails', method:'post', data:searchParams })
        console.log(response);
        return response;
    } catch (error) {
        console.log("Error in the Leave Fetch Functionality in leaveSlice :: " + error.message);
        throw error;
    }
})

export const leaveAction = createAsyncThunk('leaveaction', async(params) => {
    try {
        const response = await httpRequest({ path: '/api/leaves/leaveaction', method:'post', data:params})
        console.log(response);
        return response;
    } catch (error) {
        console.log("Error in the Leave Action Functionality in leaveSlice :: " + error.message)
        throw error
    }
})

export const applyLeave = createAsyncThunk('applyLeave', async (leaveParams) => {
    console.log(leaveParams);
    const response = await httpRequest({path: "/api/leaves/applyleave", method: "post", data:leaveParams});
    console.log(response);
    return response;
})
const initialState = {
    data: [{ records:[], page:1, limit:10, totalRecord:0 }],
    status: 'idel',
    error: null
}

const leaveSlice = createSlice({
    name: 'leave',
    initialState,
    reducers:{},
    extraReducers: (builer) => {
        builer.addCase(fetchLeaves.pending,(state)=>{
            state.status = "pending";
        }).addCase(fetchLeaves.fulfilled, (state,action) => {
            state.status        = "fulfilled";
            const records       = action.payload.data || []
            const page          =  action.payload.page || 1
            const limit         = action.payload.limit || 10
            const totalRecord   = action.payload.totalRecord || 0
            
            if(action.payload.success){
                state.data = { records, page, limit, totalRecord }
            }else{

                if(!action.payload.success && action.payload.error !== undefined ) { 
                    alert(action.payload.error);
                    return false
                }
                // state.error = action.payload.message;
                state.data = { records:{}, page:0, limit:10, totalRecord:0 };
            }
        }).addCase(fetchLeaves.rejected, (state,action) => {
            state.status = "rejected";
        }).addCase(leaveAction.pending, (state)=>{
            state.status = "Pending";
        }).addCase(leaveAction.fulfilled, (state,action) => {
            state.status = "fulfilled";

            if(action.payload.success === true){
                const updatedLeave = action.payload.data[0];
                const existingLeave = state.data.records.findIndex(leave => leave.leaveId === updatedLeave.leaveId );
                if( existingLeave >= 0 ){
                    state.data.records = state.data.records.map(leave => leave.leaveId === updatedLeave.leaveId ? updatedLeave : leave )
                    console.log(updatedLeave)

                    toast.success(`The Leave has been ${updatedLeave.leaveStatus} successfully.`, {
                        duration: 10000,
                        position: "top-right",
                        hideProgressBar: false,
                        closeButton: true,
                    });
                }
            }else if(action.payload.success === false){
                state.error=action.payload.message;
            }
        }).addCase(leaveAction.rejected, (state,action) => {
            state.status = "rejected";
            state.error=action.payload.message;
        }).addCase(applyLeave.pending, (state) => {
            state.status = "pending";
        }).addCase(applyLeave.fulfilled, (state,action) => {
            
            if(action.payload.success){
                console.log(action.payload.data[0]);
                console.log(state.data.records.length);
                // state.data.records.length?(state.data.records).unshift(action.payload.data[0]):(state.data.records).push(action.payload.data[0]);
                if (state.data.records.length) {
                    // If records exist, unshift (add to the beginning)
                    state.data.records = [action.payload.data[0], ...state.data.records];
                } else {
                    // If records are empty, push (add to the end)
                    // state.data.records = [...state.data.records, action.payload.data[0]];
                    state.data.records = [action.payload.data[0]];

                }

                state.data.totalRecord++;
                state.status = "fulfilled";
            }else{
                state.error = action.payload.error;
            }
        }).addCase(applyLeave.rejected, (state) => {
            state.status = 'rejected';
        })
    }

})

export default leaveSlice.reducer