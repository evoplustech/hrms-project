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
});

export const createDepartment = createAsyncThunk('/department/create',async(data)=>{
  try{
    const response = await httpRequest({path:'/api/configure/picklist/department/create',method:'post',data});
    return response;
  }catch(error){

  }
})

export const updateDepartment = createAsyncThunk('/department/update',async(data)=>{
  try{
    const {_id} = data;
    const response = await httpRequest({path:'/api/configure/picklist/department/update',method:'put',data,params:_id});
    return response;
  }catch(error){

  }
})

export const deleteDepartment = createAsyncThunk('/department/delete',async(paramID)=>{
  try{
    const response = await httpRequest({path:'/api/configure/picklist/department/activateDeactivate',method:'delete',params:paramID});
    return response;
  }catch(error){

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
          state.error = action.payload.error;
       }
    }).addCase(fetchAllDepartment.rejected,(state,action)=>{
      console.log('fetchAllDepartment.rejected');
     
    }).addCase(createDepartment.pending,(state,action)=>{
          state.status= 'pending'
    }).addCase(createDepartment.fulfilled,(state,action)=>{
          state.status = "success";
          if(action.payload.success && Object.entries(action.payload.data).length > 0){
            const responseData = action['payload'].data;
            state.data.push(responseData);
            state.error = null;
        }else{
            state.error = action.payload.error;
       }
    }).addCase(createDepartment.rejected,(state,action)=>{
          state.status= 'failed'
    }).addCase(updateDepartment.pending,(state,action)=>{
      state.status= 'pending'
    }).addCase(updateDepartment.fulfilled,(state,action)=>{
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
    }).addCase(updateDepartment.rejected,(state,action)=>{
          state.status= 'failed'
    }).addCase(deleteDepartment.pending,(state,action)=>{
      state.status= 'pending'
    }).addCase(deleteDepartment.fulfilled,(state,action)=>{
        state.status= 'success'
        const responseData = action.payload.data
        console.log('slice response data',responseData);
        if(action.payload.success && Object.entries(responseData).length > 0){
              state.data = state.data.filter((value)=>(
                  value._id!==responseData._id
              ));
            state.error = null;
        }else{
          state.error = action.payload.error;
        }
    }).addCase(deleteDepartment.rejected,(state,action)=>{
      state.status= 'failed'
    });
    }
  });


export default departmentSlice.reducer;





































