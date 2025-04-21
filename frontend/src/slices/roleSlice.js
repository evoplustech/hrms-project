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

export const createRole = createAsyncThunk('/role/create',async(data)=>{
  try{
    const response = await httpRequest({path:'/api/configure/picklist/role/create',method:'post',data});
    return response;
  }catch(error){

  }
})

export const updateRole = createAsyncThunk('/role/update',async(data)=>{
  try{
    const {_id} = data;
    const response = await httpRequest({path:'/api/configure/picklist/role/update',method:'put',data,params:_id});
    return response;
  }catch(error){

  }
})

export const deleteRole = createAsyncThunk('/role/delete',async(paramID)=>{
  try{
    const response = await httpRequest({path:'/api/configure/picklist/role/activateDeactivate',method:'delete',params:paramID});
    return response;
  }catch(error){

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
    }).addCase(createRole.pending,(state,action)=>{
              state.status= 'pending'
        }).addCase(createRole.fulfilled,(state,action)=>{
              state.status = "success";
              if(action.payload.success && Object.entries(action.payload.data).length > 0){
                const responseData = action['payload'].data;
                state.data.push(responseData);
                state.error = null;
            }else{
                state.error = action.payload.error;
           }
        }).addCase(createRole.rejected,(state,action)=>{
              state.status= 'failed'
        }).addCase(updateRole.pending,(state,action)=>{
          state.status= 'pending'
        }).addCase(updateRole.fulfilled,(state,action)=>{
            state.status= 'success';
            const responseData = action.payload.data
            if(action.payload.success && Object.entries(responseData).length > 0){
                  state.data = state.data.map((value)=>(
                      value._id===responseData._id ? {...value,...responseData} : value
                  ));
                state.error = null;
            }else{
              state.error = action.payload.error;
            }
        }).addCase(updateRole.rejected,(state,action)=>{
              state.status= 'failed'
        }).addCase(deleteRole.pending,(state,action)=>{
          state.status= 'pending'
        }).addCase(deleteRole.fulfilled,(state,action)=>{
            state.status= 'success'
            const responseData = action.payload.data
            if(action.payload.success && Object.entries(responseData).length > 0){
                  state.data = state.data.filter((value)=>(
                      value._id!==responseData._id
                  ));
                state.error = null;
            }else{
              state.error = action.payload.error;
            }
        }).addCase(deleteRole.rejected,(state,action)=>{
          state.status= 'failed'
        });
  }
});


export default roleSlice.reducer;





































