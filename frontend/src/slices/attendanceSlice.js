import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";



export const fetchAttendance = createAsyncThunk('/attendance/getAttendance',async ({id,dateParam})=>{
  try{ 
    const path =`/api/attendance/getAttendance?employeeId=${id}&date=${dateParam}`;
    const response =  await httpRequest({path,method:"GET"});
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
const attendanceSlice = createSlice({
  name:'attendanceSlice',
  initialState,
  reducers:{
    updateAttendance(state,action){
      const {data} = state;
      const {date,status,_id} = action.payload;
      const updatedState = data.length > 0 ? state.data.map((value)=> (value.employeeId === action.payload.employeeId && new Date(value.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]) ? {...value,related:{date,status,_id}}:{...value}):state;
      return {...state,data:updatedState};
    }
  },
  extraReducers:(builder)=>{
    builder.addCase(fetchAttendance.pending,(state,action)=>{
      console.log('pending');
       state.status= 'pending'
    }).addCase(fetchAttendance.fulfilled,(state,action)=>{
      console.log('fulfilled');
      state.status= 'success';
      if(action.payload.success){
        state.data = action.payload.data;
        state.error = null;
      }else{
        state.data = {};
        state.error = action.payload.error;
     }
    }).addCase(fetchAttendance.rejected,(state,action)=>{
      console.log('fetchAttendance.rejected');
    })
  }
});

export const {updateAttendance} =  attendanceSlice.actions;
export default attendanceSlice.reducer;



