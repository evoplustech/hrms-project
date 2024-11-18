import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";



const store = configureStore({
reducer : {
  authenticate : authSlice
  // Slices goes here
}
})

export default store;