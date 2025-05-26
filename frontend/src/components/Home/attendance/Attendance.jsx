import React from 'react'
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom'
import { fetchAllEmployees } from '../../../slices/employeeSlice';

const Attendance = () => {
    const dispatch = useDispatch();
    const {role} = JSON.parse(localStorage.getItem("emplog") || '') || {};
    const tab = localStorage.getItem("tab") || '';
    console.log('this is data',role.name,tab);
    if(role.name.toLowerCase()!=='employee' && tab !=='attendance'){
      localStorage.setItem("tab","attendance");
      dispatch(fetchAllEmployees({
        designation : "All",department:"All",status : true,role : "All",search :"",profile: "0",page :1,limit:10
      }));
      
    }

  return (
    <main className="mt-36 w-full  p-6  ms-6 me-2 mb-40 ">
      <Outlet></Outlet>
    </main>
  )
}

export default Attendance




