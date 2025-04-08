import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";

export const addAttendanceRequest = createAsyncThunk('/create/attendanceRequest',async (data)=>{
  try{
      const path =`/api/attendance/createRequest`;
      const response =  await httpRequest({path,method:"POST",data});
      return response;
  }catch(error){

  }
});

export const getAttendanceRequest = createAsyncThunk('/get/attendanceRequest',async (urlData)=>{
  try{
    const  {empid,id,startDate,endDate,status,requestType,page,limit} = urlData; 
    const path = `/api/attendance/getRequest?empid=${empid}&id=${id}&startDate=${startDate}&endDate=${endDate}&status=${status}&requestType=${requestType}&page=${page}&limit=${limit}`;
    const response =  await httpRequest({path,method:"GET"});
    console.log('attendance response',response);
    return  response;
  }catch(error){

  }
});

export const approveAttendanceRequest = createAsyncThunk('/update/attendanceRequest',async({path,data})=>{
  try{
    const response =  await httpRequest({path,method:"PUT",data});
    console.log('attendance response',response);
    return  response;
  }catch(error){
  }
})


const initialState = {
  data : [],
  status : 'idle',
  error: null,
  count: 0
};

const attendanceRequestSlice = createSlice({
  name : "attendanceRequestSlice",
  initialState,
  extraReducers : (builders)=>{
    builders.addCase(addAttendanceRequest.pending,(state,action)=>{
        state.status= 'pending'
    }).addCase(addAttendanceRequest.fulfilled,(state,action)=>{
      state.status= 'success';
      if(action.payload.success && Object.entries(action.payload.data).length > 0){
        console.log(action.payload.data,'count',action.payload.count);
        state.data.push(action.payload.data);
        state.error = null;
      }else{
        state.data = {};
        state.error = action.payload.error;
     }
    }).addCase(addAttendanceRequest.rejected,(state,action)=>{

    }).addCase(getAttendanceRequest.pending,(state,action)=>{
      state.status= 'pending'
    }).addCase(getAttendanceRequest.fulfilled,(state,action)=>{
    state.status= 'success';
    state.count = action.payload.count;
    if(action.payload.success && Object.entries(action.payload.data).length > 0){
      console.log(action.payload.data);
      state.data= action.payload.data;
      state.error = null;
    }else{
      state.data = {};
      state.error = action.payload.error;
   }
  }).addCase(getAttendanceRequest.rejected,(state,action)=>{

  }).addCase(approveAttendanceRequest.pending,(state,action)=>{
      state.status= 'pending'
  }).addCase(approveAttendanceRequest.fulfilled,(state,action)=>{
    state.status= 'success';
    const {data} = action.payload;
    if(action.payload.success && data?._id){
      const updatedData = state.data.map((value)=>{
        return value._id===data._id ? {...value,...data} : value;
      })
      state.data = updatedData;     
      state.error = null;
    }else{
      state.error = action.payload.Error;
   }
  }).addCase(approveAttendanceRequest.rejected,(state,action)=>{
    state.status = 'failed'; // Indicate failure state
    state.error = action.payload || action.error.message;
  })
  }
});


export default attendanceRequestSlice.reducer;