import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import httpRequest from "../../utils/httpRequest";
import toast from "react-hot-toast";

export const getHolidayList = createAsyncThunk("get/holidaylist", (params)=>{
    try {
        const response = httpRequest({path:"/api/holiday/getholiday",method:"post",data:params});
        return response;
    } catch (error) {
        console.log(`Error in the getHolidayList function in the holidaySlice File :: ${error.message}`);
        throw error;
    }
})

export const addHoliday = createAsyncThunk("add/holiday",(params)=>{
    try {
        const response = httpRequest({ path:"/api/holiday/addholiday", method:"post", data:params });
        return response;
    } catch (error) {
        console.log(`Error in the getHolidayList function in the holidaySlice File :: ${error.message}`);
        throw error;
    }
})

export const deleteHoliday = createAsyncThunk("delete/holiday", (_id) => {
    try {
        const response = httpRequest({path:"/api/holiday/deleteholiday", method:"post", data:_id});
        return response;
    } catch (error) {
        console.log(`Error in the DeleteHoliday function in the holidaySlice File :: ${error.message}`)
        throw error;
    }

})

export const holidaySheetUpload =  createAsyncThunk("upload/holidaysheet",(params)=>{
    try {

        const response = httpRequest({path:"/api/holiday/uploadholidaysheet", method:"post", data:params})
        return response;
    } catch (error) {
        console.log(`Error in the holidaySheetUpload function in the holidaySlice File :: ${error.message}`)
        throw error;
    }
})

const initialState= {
    status:"idel",
    data: [],
    error: null
}

const holidaySlice = createSlice({
    name: "holiday",
    initialState,
    reducers:{},
    extraReducers: (bulider) => {
        bulider.addCase(getHolidayList.pending,(state)=>{
            state.status = "pending";
        }).addCase(getHolidayList.fulfilled, (state, action)=>{
            if(action.payload.success){
                state.data = action.payload.data
                state.error = null;
            }else{
                state.error = action.payload.message
                state.data = [];
            }
            state.status = "fulfilled";
        }).addCase(getHolidayList.rejected,(state, action)=>{
            state.status = "rejected";
            state.error = action.payload.error;
        }).addCase(deleteHoliday.pending, (state) => {
            state.status = "pending";
        }).addCase(deleteHoliday.fulfilled,(state,action)=>{
            state.data = state.data.filter(holiday => holiday._id !== action.payload.data._id);
            toast.success("Holiday Deleted Successfully.",{duration:6000});
            state.status = "fulfilled";
        }).addCase(deleteHoliday.rejected, (state) => {
            state.status = "rejected";
        }).addCase(addHoliday.pending, (state) => {
            state.status = "pending";
        }).addCase(addHoliday.fulfilled, (state,action) => {

            if(action.payload.success){

                const UpdatedHoliday = action.payload.data[0];

                const updateHoliday = state.data.findIndex(device => device._id === UpdatedHoliday._id);
                console.log(updateHoliday)
                if(updateHoliday>=0){
                    console.log("1")
                    state.data = state.data.map(holiday => (holiday._id === action.payload.data[0]._id)?action.payload.data[0]: holiday);
                }else{
                    console.log("0")
                    state.data.push(action.payload.data[0]);
                }
                toast.success(action.payload.message,{duration:5000});
            }else{
                toast.success(action.payload.message,{duration:5000});
                // console.log()
                
            }
            state.status = "fulfilled";
        }).addCase(addHoliday.rejected, (state,action)=>{
            state.status = "rejected";
            state.error = "Something went wrong Refresh the Page and try again";
            state.data = [];
        }).addCase(holidaySheetUpload.pending, (state,action) => {
            state.status = "pending";
        }).addCase(holidaySheetUpload.fulfilled, (state,action) => {
            console.log(action.payload);
            if(action.payload.success){
                if(action.payload.data !== undefined){
                    state.data = action.payload.data;
                    toast.success( action.payload.message, {duration:5000} );
                }else{
                    toast.success( `${action.payload.existingHolidayList}\n ${action.payload.message}`, {duration:10000} );
                }
            }else{
                toast.error(action.payload.message,{duration:5000})
            }
            state.status = "fulfilled"
        }).addCase(holidaySheetUpload.rejected, (state,action)=>{
            state.status = "rejected";
            state.error = "Something went wrong Refresh the Page and try again";
        })
    }
})

export default holidaySlice.reducer