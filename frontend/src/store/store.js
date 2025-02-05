import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import employeeSlice from "../slices/employeeSlice"
import departmentSlice from "../slices/departmentSlice"
import roleSlice from "../slices/roleSlice";
import designationSlice from "../slices/designationSlice";
import shiftSlice from "../slices/shiftSlice";
import moduleSlice from "../slices/moduleSlice";
import biometriSlice from "../slices/biometricSlice"



const store = configureStore({
reducer : {
  authenticate : authSlice,
  employee:employeeSlice,
  role:roleSlice,
  department:departmentSlice,
  designation : designationSlice,
  shift:shiftSlice,
  module:moduleSlice,
  biometric: biometriSlice

  // Slices goes here
}
})

export default store;