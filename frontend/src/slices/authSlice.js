import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

export const LoginMiddleware = createAsyncThunk('auth/login',async (formData)=>{
  try{
    const  response = await fetch('https://hrms-project-backend.onrender.com/api/authorize/login',{
      method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(formData)
    });
    const result = await response.json();
    return result;
  }catch(error){
    console.log(error.message);
  }

})

export const LogOutMiddleware = createAsyncThunk('auth/logout',async()=>{

  try{
    console.log('logout triggered');
      const  response = await fetch('https://hrms-project-backend.onrender.com/api/authorize/logout',{
        method:"GET",
        headers:{"Content-Type":"application/json"}
      });
      const result = await response.json();
      console.log(result);
      return result;
  }catch(error){
    console.log(error.message);
  }
  
})

const loggedData =(JSON.parse(localStorage.getItem("emplog")) || '');
// jwtDecode() 

const initialState = {
  data : loggedData?loggedData:{},
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
          const {empPersonalId,role:{name}} = action.payload.data;
          const {firstName,lastName}=empPersonalId;
          localStorage.setItem("emplog",JSON.stringify(action.payload.data));
          state.isLogged =true;
          state.error = '';
        }else{
          state.error = action.payload.error;
        }
        state.status = "success";
      if(action.payload.success){
        state.data = action.payload.data;
        localStorage.setItem("emplog",JSON.stringify(action.payload.data));
        state.isLogged =true;
        state.error = '';
      }else{
        state.error = action.payload.error;
        // console.log(action.payload.error);
        // toast.error(action.payload.error,{duration:10000})
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


export const getUserRole  = (state) => state.authenticate.data.role.name.toLowerCase();

export default authSlice.reducer;



