import { createSlice } from "@reduxjs/toolkit"; 
import { createAsyncThunk } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";



export const fetchAllShifts = createAsyncThunk('/shift/getAll', async ()=>{
  try{    
      const response = await httpRequest({path:'/api/shift/AllShifts',method:'get'});
      console.log(response);
      return response;
  }catch(error){
      console.log(error);
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
    })
  }
});


export default shiftSlice.reducer;
