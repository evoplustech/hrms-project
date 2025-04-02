import React, { useState } from 'react'
import GridView from './GridView';
import { TbFaceIdError } from "react-icons/tb";


const EmployeeGrid = ({data,count,loading}) => {

  const activeEmployee = data.filter((value)=> value.empPersonalId );
 
  return (
    <>
        <div className="flex justify-end mt-2"><span className="font-bold">Total Records</span> : {count || 0}</div>
        {activeEmployee.length > 0 && 
        <div className="grid md:grid-cols-3 grid-cols-2 mt-2 space-y-4 ">
            {
              activeEmployee.map((value)=>{
                
                  return <GridView key={value._id} employeeId={value.employeeId} name={`${value['empPersonalId'].firstName} ${value['empPersonalId'].lastName}`} email = {value.email} department={value['department'].name} designation={value['designation'].name} pic={value['empPersonalId'].profilepic}/>
              })  
              
            }
        </div> ||
        <div className="w-full  bg-gray-200 border-2 border-l-slate-900">
          <div className="flex space-x-6  items-center my-2 ps-2 py-6 justify-center">
            <TbFaceIdError className="w-12 h-12 text-slate-400 me-2" />
              <span>No Records Found </span>
          </div>
        </div>
        }
    </>
  )
}

export default EmployeeGrid