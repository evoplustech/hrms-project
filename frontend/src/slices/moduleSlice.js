import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";


export const createMoule = createAsyncThunk('module/create',async (data)=>{
    const response = await httpRequest({path:'/api/configure/module/create',method:'post',data});
    return response;
});

export const getModules = createAsyncThunk('module/getAll',async ()=>{
  const response = await httpRequest({path:'/api/configure/module/getAll',method:'get'});
  return response;
});


const initialState = {
  data : [],
  status : 'idle',
  error: null
}

const moduleSlice  = createSlice({
  name:'moduleSlice',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(getModules.pending,(state,action)=>{
      console.log('module.pending');
      state.status= 'pending'
    }).addCase(getModules.fulfilled,(state,action)=>{
      console.log('module.fulfilled');
      state.status= 'success';
       if(action.payload.success){
        console.log(action.payload.data);
        state.data=action.payload.data;
        state.error = null;
       }
    }).addCase(getModules.rejected,(state,action)=>{
        state.status= 'failed';
    }).addCase(createMoule.pending,(state,action)=>{
        state.status= 'pending'
        state.error = null;
    }).addCase(createMoule.fulfilled,(state,action)=>{
        console.log('module.fulfilled');
        state.status= 'success';
       if(action.payload.success){
          if(action.payload.data?.name)
            state.data.push(action.payload.data);
          state.error = null;
       }else{
          state.error = action.payload.error;
       }
    }).addCase(createMoule.rejected,(state,action)=>{
      state.status= 'failed';
  })
  }
});


export default moduleSlice.reducer