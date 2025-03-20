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
          state.data = {};
          state.error = action.payload.error;
       }
      }).addCase(fetchReasons.rejected,(state,action)=>{
        
      })
  }
})

export default reasonSlice.reducer;
