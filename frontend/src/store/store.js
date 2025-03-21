import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import employeeSlice from "../slices/employeeSlice"
import departmentSlice from "../slices/departmentSlice"
import roleSlice from "../slices/roleSlice";
import designationSlice from "../slices/designationSlice";
import shiftSlice from "../slices/shiftSlice";
import moduleSlice from "../slices/moduleSlice";
import attendanceSlice from "../slices/attendanceSlice";
import reasonSlice from "../slices/reasonSlice";
import attendanceRequestSlice from "../slices/attendanceRequestSlice";



const store = configureStore({
reducer : {
  authenticate : authSlice,
  employee:employeeSlice,
  attendance : attendanceSlice,
  role:roleSlice,
  department:departmentSlice,
  designation : designationSlice,
  shift:shiftSlice,
  module:moduleSlice,
  reason : reasonSlice,
  attendanceRequest:attendanceRequestSlice

  // Slices goes here
}
})

export default store;