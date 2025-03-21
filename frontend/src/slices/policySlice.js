import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";

export const fetchPolicy = createAsyncThunk('fetch/policy',async ()=>{
    try {
        const response = await httpRequest({path:'/api/policy/getallpolicy',method:'get'})
        return response;
    } catch (error) {
        console.error('Error in Fetch Policy functionality in Policy Slice file:', error.message);
        throw error; 
    }
})

export const deletePoclicyFetch = createAsyncThunk('delete/policy', async({id}) => {
    try {
        const response = await httpRequest({path:'/api/policy/deletepolicy',method:'post',data:{id}})
        return response;
    } catch (error) {
        console.log('Error in Delete Policy functionality in Policy Slice file:', error.message);
        throw error; 
    }
})

export const addPolicy = createAsyncThunk('add/newpolicy', async (data)=>{
    try {
        const response = await httpRequest({path: '/api/policy/addpolicy',method:'post',data})
        return response;
    } catch (error) {
        console.log('Error in Add Policy functionality in Policy Slice file:', error.message);
        throw error
    }
})

export const updatePolicy = createAsyncThunk ('update/policy', async (data) =>{
    try {
        const response = await httpRequest({path: '/api/policy/updatepolicy',method:'post',data})
        return response;
    } catch (error) {
        console.log('Error in Update Policy functionality in Policy Slice file:', error.message);
        throw error
    }
})

// Initial state
const initialState = {
    data: [],
    status: "idle", // Default state for request status
    error: null
};

const policySlice = createSlice({
    name: 'policy',
    initialState,
    reducers:{
        // deletePoclicyFetch: (state,action)=>{
        //     state.data = state.data.filter(data =>  data._id !== action.payload.id)
        // }
    },
    extraReducers: (builder) =>{
        builder.addCase(fetchPolicy.pending, (state) => {
            state.status = "pending";
        }).addCase(fetchPolicy.fulfilled, (state,action) => {
            state.status = "success";
            state.data = action.payload.data
        }).addCase(fetchPolicy.rejected,(state,action) => {
            state.status = 'rejected';
            state.error = action.error.message
        }).addCase(deletePoclicyFetch.pending,(state)=>{
            state.status = "pending";
        }).addCase(deletePoclicyFetch.fulfilled, (state,action)=>{
            state.status = "success";
            state.data = state.data.filter(data => data._id !== action.payload.deleteId)
            alert('Policy Deleted Successfully')
        }).addCase(deletePoclicyFetch.rejected , (state,action)=>{
            state.status = "rejected";
            state.error = action.payload.message;
        }).addCase(addPolicy.pending,(state)=>{
            state.status = "pending"
        }).addCase(addPolicy.fulfilled, (state,action)=>{
            state.status = "success";
            if(action.payload.success){
                state.data.push(action.payload.data)
                alert('New Policy Added successfully.')
            }else{
                state.error = action.payload.message
            }
        }).addCase(addPolicy.rejected,(state,action)=>{
            state.status = "rejected";

        }).addCase(updatePolicy.pending, (state)=>{
            state.state = "pending";
        }).addCase(updatePolicy.fulfilled, (state,action)=>{
            state.status = "fullfilled";

            const newPolicy = action.payload.data; 
            const updatePolicyData = state.data.findIndex(device => device._id === newPolicy._id);

            if (updatePolicyData >= 0) {

                state.data = state.data.map(device => 
                  device._id === newPolicy._id ? newPolicy : device
                );
                alert('Policy Updated successfully.')
            }

        }).addCase(updatePolicy.rejected,(state, action)=>{
            state.status = "rejected";
        })
    }
})

// export const { deletePoclicyFetch } = policySlice.actions

export default policySlice.reducer