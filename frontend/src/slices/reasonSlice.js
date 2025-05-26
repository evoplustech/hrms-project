import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";


export const  fetchReasons = createAsyncThunk('/reason/getAll',async()=>{
  try{
    const path =`/api/configure/picklist/reason/getAll`;
    const response =  await httpRequest({path,method:"GET"});
    return response;
  }catch(error){

  }
})

export const createReasons = createAsyncThunk('/reason/create',async(data)=>{
  try{
    const response = await httpRequest({path:'/api/configure/picklist/reason/create',method:'post',data});
    return response;
  }catch(error){

  }
})

export const updateReasons = createAsyncThunk('/reason/update',async(data)=>{
  try{
    const {_id} = data;
    const response = await httpRequest({path:'/api/configure/picklist/reason/update',method:'put',data,params:_id});
    return response;
  }catch(error){

  }
})

export const deleteReasons = createAsyncThunk('/reason/delete',async(paramID)=>{
  try{
    const response = await httpRequest({path:'/api/configure/picklist/reason/activateDeactivate',method:'delete',params:paramID});
    return response;
  }catch(error){

  }
})

const initialState = {
  data : [],
  status : 'idle',
  error: null
};

const reasonSlice = createSlice({
  name:'reasonSlice',
  initialState,
  reducers:{},
  extraReducers:(builders)=>{
      builders.addCase(fetchReasons.pending,(state,action)=>{
           state.status= 'pending'
      }).addCase(fetchReasons.fulfilled,(state,action)=>{
        state.status= 'success';
        if(action.payload.success){
          state.data = action.payload.data;
          state.error = null;
        }else{
          state.data = [];
          state.error = action.payload.error;
       }
      }).addCase(fetchReasons.rejected,(state,action)=>{
        
      }).addCase(createReasons.pending,(state,action)=>{
                    state.status= 'pending'
              }).addCase(createReasons.fulfilled,(state,action)=>{
                    state.status = "success";
                    if(action.payload.success && Object.entries(action.payload.data).length > 0){
                      const responseData = action['payload'].data;
                      state.data.push(responseData);
                      state.error = null;
                  }else{
                      state.error = action.payload.error;
                 }
              }).addCase(createReasons.rejected,(state,action)=>{
                    state.status= 'failed'
              }).addCase(updateReasons.pending,(state,action)=>{
                state.status= 'pending'
              }).addCase(updateReasons.fulfilled,(state,action)=>{
                  state.status= 'success';
                  const responseData = action.payload.data
                  if(action.payload.success && Object.entries(responseData).length > 0){
                        state.data = state.data.map((value)=>(
                            value._id===responseData._id ? {...value,...responseData} : value
                        ));
                      state.error = null;
                  }else{
                    state.error = action.payload.error;
                  }
              }).addCase(updateReasons.rejected,(state,action)=>{
                    state.status= 'failed'
              }).addCase(deleteReasons.pending,(state,action)=>{
                state.status= 'pending'
              }).addCase(deleteReasons.fulfilled,(state,action)=>{
                  state.status= 'success'
                  const responseData = action.payload.data
                  if(action.payload.success && Object.entries(responseData).length > 0){
                        state.data = state.data.filter((value)=>(
                            value._id!==responseData._id
                        ));
                      state.error = null;
                  }else{
                    state.error = action.payload.error;
                  }
              }).addCase(deleteReasons.rejected,(state,action)=>{
                state.status= 'failed'
              });
  }
})

export default reasonSlice.reducer;
