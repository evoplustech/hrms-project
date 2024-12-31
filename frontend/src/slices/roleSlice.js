import { createSlice } from "@reduxjs/toolkit"; 
import { createAsyncThunk } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";



export const fetchAllRoles = createAsyncThunk('/role/getAll', async ()=>{
  try{    
      const response = await httpRequest({path:'/api/configure/picklist/role/getAll',method:'get'});
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

const roleSlice = createSlice({
  name:'roleSlice',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(fetchAllRoles.pending,(state,action)=>{
      console.log('fetchAllRoles.pending');
       state.status= 'pending'
    }).addCase(fetchAllRoles.fulfilled,(state,action)=>{
      console.log('fetchAllRoles.fulfilled');
      state.status= 'success';
       if(action.payload.success){
        state.data = action.payload.data;
        // localStorage.setItem("emplog",JSON.stringify(action.payload.data));
        state.error = null;
       }else{
          state.data = {};
          state.error = action.payload.error;
       }
    }).addCase(fetchAllRoles.rejected,(state,action)=>{
      console.log('fetchAllRoles.rejected');
      // state.error = null;
      // state.status= 'failed';
      // state.data={};
    })
  }
});


export default roleSlice.reducer;





































