import { createSlice } from "@reduxjs/toolkit"; 
import { createAsyncThunk } from "@reduxjs/toolkit";
import httpRequest from "../../utils/httpRequest";



export const fetchAllDesignation = createAsyncThunk('/designation/getAll', async ()=>{
  try{      
      const response = await httpRequest({path:'/api/configure/picklist/designation/getAll',method:'get'});
      console.log(response);
      return response;
  }catch(error){
      console.log(error);
  }
})

export const createDesignation = createAsyncThunk('/designation/create',async(data)=>{
  try{
    const response = await httpRequest({path:'/api/configure/picklist/designation/create',method:'post',data});
    return response;
  }catch(error){

  }
})

export const updateDesignation = createAsyncThunk('/designation/update',async(data)=>{
  try{
    const {_id} = data;
    const response = await httpRequest({path:'/api/configure/picklist/designation/update',method:'put',data,params:_id});
    return response;
  }catch(error){

  }
})

export const deleteDesignation = createAsyncThunk('/designation/delete',async(paramID)=>{
  try{
    const response = await httpRequest({path:'/api/configure/picklist/designation/activateDeactivate',method:'delete',params:paramID});
    return response;
  }catch(error){
  }
})


const initialState = {
  data : [],
  status : 'idle',
  error: null
}

const designationSlice = createSlice({
  name:'designationSlice',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(fetchAllDesignation.pending,(state,action)=>{
      console.log('fetchAllDesignationSlice.pending');
       state.status= 'pending'
    }).addCase(fetchAllDesignation.fulfilled,(state,action)=>{
      console.log('fetchAllDesignationSlice.fulfilled');
      state.status= 'success';
       if(action.payload.success){
        state.data = action.payload.data;
        // localStorage.setItem("emplog",JSON.stringify(action.payload.data));
        state.error = null;
       }else{
          state.data = {};
          state.error = action.payload.error;
       }
    }).addCase(fetchAllDesignation.rejected,(state,action)=>{
      console.log('fetchAllDesignationSlice.rejected');
      // state.error = null;
      // state.status= 'failed';
      // state.data={};
    }).addCase(createDesignation.pending,(state,action)=>{
              state.status= 'pending'
        }).addCase(createDesignation.fulfilled,(state,action)=>{
              state.status = "success";
              if(action.payload.success && Object.entries(action.payload.data).length > 0){
                const responseData = action['payload'].data;
                state.data.push(responseData);
                state.error = null;
            }else{
                state.error = action.payload.error;
           }
        }).addCase(createDesignation.rejected,(state,action)=>{
              state.status= 'failed'
        }).addCase(updateDesignation.pending,(state,action)=>{
          state.status= 'pending'
        }).addCase(updateDesignation.fulfilled,(state,action)=>{
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
        }).addCase(updateDesignation.rejected,(state,action)=>{
              state.status= 'failed'
        }).addCase(deleteDesignation.pending,(state,action)=>{
          state.status= 'pending'
        }).addCase(deleteDesignation.fulfilled,(state,action)=>{
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
        }).addCase(deleteDesignation.rejected,(state,action)=>{
          state.status= 'failed'
        });
  }
});


export default designationSlice.reducer;





































