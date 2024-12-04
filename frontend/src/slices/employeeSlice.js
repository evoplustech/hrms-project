import { createSlice } from "@reduxjs/toolkit"; 
import { createAsyncThunk } from "@reduxjs/toolkit";



export const employeePersonalDetail = createAsyncThunk('/employee/personalDataCreate',async(formdata)=>{
    try{
      const response = await fetch('/api/employee/create/personal',{
        method:"POST",
        headers : {
          "Content-Type":"application/json"
        },
        body:JSON.stringify(formdata)
      });

      const result = await response.json();
      console.log(result);
      return result;
    }catch(error){

    }
}); 

export const employeeProfessionalDetail = createAsyncThunk('/employee/professionalDataCreate',async (formData)=>{
  try{
    const response = await fetch('/api/employee/create/professional',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body : JSON.stringify(formData)
    })

  }catch(error){
    console.log(error);
  }
})

const initialState = {
  data : {},
  status : '',
  error: null
}

const employeeSlice = createSlice({
  name:'empSlice',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(employeePersonalDetail.pending,(state,action)=>{
      console.log('employeePersoanlDetail.pending');
      //  state.status= 'pending'
    }).addCase(employeePersonalDetail.fulfilled,(state,action)=>{
      console.log('employeePersoanlDetail.fulfilled');
      // state.status= 'success';
      // state.data.error = null;
      //  if(action.payload.success){
      //     const {_id} = action.payload.data;
      //     state.data.personal_id =  _id;
          
      //  }else{
      //     state.error = action.payload.error;
      //  }
    }).addCase(employeePersonalDetail.rejected,(state,action)=>{
      console.log('employeePersoanlDetail.rejected');
      // state.error = null;
      // state.status= 'failed';
      // state.data={};
    })
  }
});


export default employeeSlice.reducer;





































