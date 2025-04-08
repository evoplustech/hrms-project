import React from 'react'
import Footer from '../../layouts/Footer'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { fetchAllEmployees } from '../../../slices/employeeSlice';


const EmployeeManagement = () => {

    const dispatch = useDispatch();
    const {role} = JSON.parse(localStorage.getItem("emplog") || '') || {};
    const tab = localStorage.getItem("tab") || '';
    if(role.name.toLowerCase()!=='employee' && tab !=='employee'){
      localStorage.setItem("tab","employee");
      dispatch(fetchAllEmployees({
        designation : "All",department:"All",status : true,role : "All",search :"",profile: "0",page :1,limit:10
      }));
      
    }

  return (
    <>
    {/* w-4/5 */}
      <main className=" mt-36 w-full  p-6  ms-6 me-2 mb-40">
          <Outlet></Outlet>
      </main>
    </>
  )
}

export default EmployeeManagement