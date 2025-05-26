import { createSlice } from "@reduxjs/toolkit"; 
import { createAsyncThunk } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";



export const fetchAllEmployees = createAsyncThunk('/employee/getAll', async (params)=>{
  try{    
      const {department,designation,role,profile,status,search,page,limit} = params || {};
      const path = `/api/employee/getAllRecords?department=${department}&designation=${designation}&role=${role}&profile=${profile}&status=${status}&search=${search}&page=${page}&limit=${limit}`;

      const response = await httpRequest({path,method:'get'});
      console.log(response);
      return response;
  }catch(error){
      console.log(error);
  }
});


const initialState = {
  data : {},
  status : 'idle',
  error: null,
  count: 0
}

const employeeSlice = createSlice({
  name:'empSlice',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(fetchAllEmployees.pending,(state,action)=>{
      console.log('fetchAllEmployees.pending');
       state.status= 'pending'
    }).addCase(fetchAllEmployees.fulfilled,(state,action)=>{
      console.log('fetchAllEmployees.fulfilled');
      state.status= 'success';
      state.count = action.payload.count;
       if(action.payload.success){
        state.data = action.payload.data;
        // localStorage.setItem("emplog",JSON.stringify(action.payload.data));
        state.error = null;
       }else{
          state.data = {};
          state.error = action.payload.error;
       }
    }).addCase(fetchAllEmployees.rejected,(state,action)=>{
      console.log('fetchAllEmployees.rejected');
      // state.error = null;
      // state.status= 'failed';
      // state.data={};
    })
  }
});


export default employeeSlice.reducer;





































