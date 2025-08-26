import { createSlice } from "@reduxjs/toolkit"; 
import { createAsyncThunk } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";



export const fetchAllEmployees = createAsyncThunk('/employee/getAll', async (params)=>{
  try{    
      const {department,designation,role,profile,status,search,page,limit} = params || {};
      const path = `/api/employee/getAllRecords?department=${department}&designation=${designation}&role=${role}&profile=${profile}&status=${status}&search=${search}&page=${page}&limit=${limit}`;

      const response = await httpRequest({path,method:'get'});
      return response;
  }catch(error){
      console.log(error.message);
  }
});

export const updateEmployees = createAsyncThunk('/employee/update',async (param)=>{
  try{
    const {path,method,data} = param;
    const response = await httpRequest({path,method,data});
    return response;
  }catch(error){
    console.log(`Thunk Error updateEmployees in the api :: ${error.message}`);
  }
  
});

export const deleteEmployees = createAsyncThunk('/employee/delete',async ({params})=>{
  try{  
      const response = await httpRequest({path:'/api/employee/delete/personal',method:'delete',params});
      return response;
  }catch(error){
    console.log(`Error in DeleteEmployee Thunk Api ${error.message}`);
  }
});


const initialState = {
  data : [],
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
          state.data = [];
          state.error = action.payload.error;
       }
    }).addCase(fetchAllEmployees.rejected,(state,action)=>{
        state.status= 'failed'
    }).addCase(updateEmployees.pending,(state,action)=>{
        state.status= 'pending'
    }).addCase(updateEmployees.fulfilled,(state,action)=>{
        state.status= 'success';
        const responseData = action.payload.data;
        if(action.payload.success && Object.entries(responseData).length > 0){

            if(responseData?.empPersonalId?._id){
              const index =  state['data'].findIndex((index)=> index._id === responseData._id);
              if(index !== -1){
                state.data[index] = {
                  ...state.data[index],
                  ...responseData
                };
              }
            }else{
              const index =  state['data'].findIndex((index)=> index['empPersonalId']._id === responseData._id);
              if(index !== -1){
                state.data[index].empPersonalId = {
                  ...state.data[index].empPersonalId,
                  ...responseData
                };
              }
            }
            state.error = null;
        }else{
          state.error = action.payload.error;
        }
    }).addCase(updateEmployees.rejected,(state,action)=>{
        state.status= 'failed'
    }).addCase(deleteEmployees.pending,(state,action)=>{
        state.status= 'pending';
    }).addCase(deleteEmployees.fulfilled,(state,action)=>{
        state.status= 'success';
        const {success,data} = action.payload;
        if(success){
          state.data = state.data.filter(value => value._id !==data._id);
          state.error = null;
          state.count = state.count-1;
        }else{
          state.error = action.payload.error;
        }
    }).addCase(deleteEmployees.rejected,(state,action)=>{
        state.status= 'failed';
    })
  }
});


export default employeeSlice.reducer;





































