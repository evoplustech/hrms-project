import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const LoginMiddleware = createAsyncThunk('auth/login',async (formData)=>{
      const  response = await fetch('/api/authorize/login',{
        method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(formData)
      });
      const result = await response.json();
      return result;
})

export const LogOutMiddleware = createAsyncThunk('auth/logout',async()=>{
  console.log('logout triggered');
      const  response = await fetch('/api/authorize/logout',{
        method:"GET",
        headers:{"Content-Type":"application/json"}
      });
      const result = await response.json();
      console.log(result);
      return result;
})



const loggedData =(JSON.parse(localStorage.getItem("emplog")) || '');


const initialState = {
  data : {},
  status:'idle',
  error:'',
  isLogged:loggedData ? true:false
}

// Asynchronous Operation To Be defined In the Extra Reducers
const authSlice = createSlice({

  name:'authenticate',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(LoginMiddleware.pending,(state,action)=>{
      console.log('LoginMiddleware pending');
        state.status='pending';
    }).addCase(LoginMiddleware.fulfilled,(state,action)=>{
      console.log('LoginMiddleware fulfilled');
        if(action.payload.success){
          state.data = action.payload.data;
          localStorage.setItem("emplog",JSON.stringify(action.payload.data));
          state.isLogged =true;
          state.error = '';
        }else{
          state.error = action.payload.error;
        }
        state.status = "success";
    }).addCase(LoginMiddleware.rejected,(state,action)=>{
      console.log('LoginMiddleware rejected');
      state.status='failed';
    }).addCase(LogOutMiddleware.fulfilled,(state,action)=>{
      console.log(action);
      if(action.payload.success){
        state.data = {};
        localStorage.removeItem("emplog");
        state.isLogged =false;
      }
        
    })
  }

});



export default authSlice.reducer;



