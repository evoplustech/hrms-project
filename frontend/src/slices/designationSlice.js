import { createSlice } from "@reduxjs/toolkit"; 
import { createAsyncThunk } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";



export const fetchAllDesignation = createAsyncThunk('/designation/getAll', async ()=>{
  try{      
      const response = await httpRequest({path:'/api/configure/picklist/designation/getAll',method:'get'});
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

const designationSlice = createSlice({
  name:'designationSlice',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(fetchAllDesignation.pending,(state,action)=>{
      console.log('fetchAllDesignationSlice.pending');
       state.status= 'pending'
    }).addCase(fetchAllDesignation.fulfilled,(state,action)=>{
      console.log('fetchAllDesignationSlice.fulfilled');
      state.status= 'success';
       if(action.payload.success){
        state.data = action.payload.data;
        // localStorage.setItem("emplog",JSON.stringify(action.payload.data));
        state.error = null;
       }else{
          state.data = {};
          state.error = action.payload.error;
       }
    }).addCase(fetchAllDesignation.rejected,(state,action)=>{
      console.log('fetchAllDesignationSlice.rejected');
      // state.error = null;
      // state.status= 'failed';
      // state.data={};
    })
  }
});


export default designationSlice.reducer;





































