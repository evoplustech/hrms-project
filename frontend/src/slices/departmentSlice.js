import { createSlice } from "@reduxjs/toolkit"; 
import { createAsyncThunk } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";



export const fetchAllDepartment = createAsyncThunk('/department/getAll', async ()=>{
  try{    
      const response = await httpRequest({path:'/api/configure/picklist/department/getAll',method:'get'});
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

const departmentSlice = createSlice({
  name:'departmentSlice',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(fetchAllDepartment.pending,(state,action)=>{
      console.log('fetchAllDepartment.pending');
       state.status= 'pending'
    }).addCase(fetchAllDepartment.fulfilled,(state,action)=>{
      console.log('fetchAllDepartment.fulfilled');
      state.status= 'success';
       if(action.payload.success){
        state.data = action.payload.data;
        state.error = null;
       }else{
          state.data = {};
          state.error = action.payload.error;
       }
    }).addCase(fetchAllDepartment.rejected,(state,action)=>{
      console.log('fetchAllDepartment.rejected');
     
    })
  }
});


export default departmentSlice.reducer;





































