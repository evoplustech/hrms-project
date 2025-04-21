import { createSlice } from "@reduxjs/toolkit"; 
import { createAsyncThunk } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";



export const fetchAllShifts = createAsyncThunk('/shift/getAll', async ()=>{
  try{    
      const response = await httpRequest({path:'/api/shift/AllShifts',method:'get'});
      return response;
  }catch(error){
      console.log(error);
  }
});

export const createShifts = createAsyncThunk('/shift/create',async(data)=>{
  try{
    const response = await httpRequest({path:'/api/shift/create',method:'post',data});
    console.log(response);
    return response;
  }catch(error){

  }
})

export const updateShifts = createAsyncThunk('/shift/update',async (data)=>{
  try{  
    const {_id} = data;
    const response = await httpRequest({path:'/api/shift/update',method:'put',data,params:_id});
    console.log('thunk response',response);
    return response;
  }catch(error){

  }
});


export const deleteShift = createAsyncThunk('/shift/delete',async(id)=>{
  try{
    const  response = await httpRequest({path:'/api/shift/delete',method:'delete',params:id});
    console.log('this is shift response',response);
    return response;
  }catch(error){

  }
})


const initialState = {
  data : [],
  status : 'idle',
  error: null
}

const shiftSlice = createSlice({
  name:'shiftSlice',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(fetchAllShifts.pending,(state,action)=>{
      console.log('fetchAllShifts.pending');
       state.status= 'pending'
    }).addCase(fetchAllShifts.fulfilled,(state,action)=>{
      console.log('fetchAllShifts.fulfilled');
      state.status= 'success';
       if(action.payload.success){
        state.data = action.payload.data;
        // localStorage.setItem("emplog",JSON.stringify(action.payload.data));
        state.error = null;
       }else{
          state.data = {};
          state.error = action.payload.error;
       }
    }).addCase(fetchAllShifts.rejected,(state,action)=>{
      console.log('fetchAllShifts.rejected');
      // state.error = null;
      // state.status= 'failed';
      // state.data={};
    }).addCase(createShifts.pending,(state,action)=>{
      state.status= 'pending'
    }).addCase(createShifts.fulfilled,(state,action)=>{
      state.status= 'success';
      if(action.payload.success && Object.entries(action.payload.data).length > 0){
          const responseData = action['payload'].data;
          state.data.push(responseData);
          state.error = null;
      }else{
        state.error = action.payload.error;
     }
    }).addCase(createShifts.rejected,(state,action)=>{
      state.status= 'failed'
    }).addCase(updateShifts.pending,(state,action)=>{
      state.status= 'pending'
    }).addCase(updateShifts.fulfilled,(state,action)=>{
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
    }).addCase(updateShifts.rejected,(state,action)=>{
      state.status= 'failed'
    }).addCase(deleteShift.pending,(state,action)=>{
      state.status= 'pending'
    }).addCase(deleteShift.fulfilled,(state,action)=>{
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
    }).addCase(deleteShift.rejected,(state,action)=>{
      state.status= 'failed'
    })
  }
});


export default shiftSlice.reducer;
