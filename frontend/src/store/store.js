import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import employeeSlice from "../slices/employeeSlice"
import departmentSlice from "../slices/departmentSlice"
import roleSlice from "../slices/roleSlice";
import designationSlice from "../slices/designationSlice";
import shiftSlice from "../slices/shiftSlice";
import moduleSlice from "../slices/moduleSlice";
<<<<<<< HEAD
import attendanceSlice from "../slices/attendanceSlice";
import reasonSlice from "../slices/reasonSlice";
import attendanceRequestSlice from "../slices/attendanceRequestSlice";

=======
import biometriSlice from "../slices/biometricSlice";
import policySlice from "../slices/policySlice";
import leaveSlice from "../slices/leaveSlice";
import leavetypeSlice from "../slices/leavetypeSlice"
import holidaySlice from "../slices/holidaySlice"
>>>>>>> Features


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
<<<<<<< HEAD
  reason : reasonSlice,
  attendanceRequest:attendanceRequestSlice
=======
  biometric: biometriSlice,
  policy: policySlice,
  leave: leaveSlice,
  leavetype: leavetypeSlice,
  holiday: holidaySlice
>>>>>>> Features

  // Slices goes here
}
})


export default store;