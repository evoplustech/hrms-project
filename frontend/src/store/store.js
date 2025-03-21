import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import employeeSlice from "../slices/employeeSlice"
import departmentSlice from "../slices/departmentSlice"
import roleSlice from "../slices/roleSlice";
import designationSlice from "../slices/designationSlice";
import shiftSlice from "../slices/shiftSlice";
import moduleSlice from "../slices/moduleSlice";
import biometriSlice from "../slices/biometricSlice";
import policySlice from "../slices/policySlice";
import leaveSlice from "../slices/leaveSlice";
import leavetypeSlice from "../slices/leavetypeSlice"
import holidaySlice from "../slices/holidaySlice"


const store = configureStore({
reducer : {
  authenticate : authSlice,
  employee:employeeSlice,
  role:roleSlice,
  department:departmentSlice,
  designation : designationSlice,
  shift:shiftSlice,
  module:moduleSlice,
  biometric: biometriSlice,
  policy: policySlice,
  leave: leaveSlice,
  leavetype: leavetypeSlice,
  holiday: holidaySlice

  // Slices goes here
}
})


export default store;