import React from 'react'
import { PiDotsThreeOutlineVerticalDuotone, PiNotePencilDuotone } from "react-icons/pi";
import useSelectorHook from '../../../../utils/useSelectorHook';
import { CgBorderStyleDashed } from "react-icons/cg";
import { FaRegDotCircle } from "react-icons/fa";
import EmployeePopUp from './EmployeePopUp';
import { useNavigate } from 'react-router-dom';

const EmployeeTable = ({data,count,loading}) => {
  
  
  const Heading = ['Employee Name','User Name','Department','Designation','Role','Status','Action'];
  const bgcolor = {'Rejected' : "bg-rose-400",'Pending':"bg-sky-400",'Approved':"bg-lime-400"}
  const navigate = useNavigate();
  const handleOpen = ()=>{
    console.log('button click');
  }

  const rowClick = (param)=>{
    localStorage.removeItem('employeeTab');
    const navLink = `/home/employee/updateEmployee/${param}`;
    navigate(navLink);
  }

  return (
    <>
      <div className="flex justify-end ms-6 mt-4">
        <label className="text-md font-semibold">Total Count</label>: {count}
      </div>
      <div className="mt-2">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className='bg-neutral-400  justify-center items-center'>
            {
              Heading.map((value)=>{
                return <th key={value} scope="col" className="px-6 py-3 text-slate-600 text-lg font-serif font-bold">
                    {value}
                </th>
              })
            }
          </tr>
      </thead>
      <tbody>
        {loading==='success' ? (data.length > 0 && data.map((value,key)=>{ 
              let name = value?.empPersonalId  ?  `${value['empPersonalId'].firstName} ${value['empPersonalId'].lastName}`: `${value['firstName']} ${value['lastName']}`;
              let empId = value?.empPersonalId ? value["empPersonalId"]._id : value._id;
              let department  = value.department ? value.department.name :<CgBorderStyleDashed />;
              let designation = value.designation ? value.designation.name :<CgBorderStyleDashed />;
              let role =  value.role ? value.role.name :<CgBorderStyleDashed />;
              let status = value?.empPersonalId ?  value.isActive : true;
           
              return <tr key= {key}  onClick={()=>(rowClick(empId))} className="bg-white border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600   text-md font-semibold">
              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <span className="flex justify-center items-center">{name}</span>
              </td>
              <td className="px-6 py-4 text-center ">
              <span className="flex justify-center items-center">{value.email || <CgBorderStyleDashed />}</span>
              </td>
              <td className="px-6 py-4">
                <span className="flex justify-center items-center">{department}</span>
              </td>
              <td className="px-6 py-4">
              <span className="text-center flex justify-center items-center">{designation}</span>
              </td>
              <td className="px-6 py-4">
              <span className="text-center flex justify-center items-center">{role}</span>
              </td>
              <td className="px-6 py-4">
                 <span className={`p-2 rounded-md  text-black text-end  flex justify-center items-center`}>
                    {status && '🟢' || '🔴'}
                 </span>
              </td>
              <td className="px-6 py-4  flex justify-center items-center">
                { value?.empPersonalId &&
              <button   onClick={(e)=>(e.stopPropagation(),handleOpen())}><EmployeePopUp personId={value['empPersonalId']._id} isActive = {value.isActive} id="dropdownDelayButton" /></button>}
              </td>
            </tr>})
            ||  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600  text-center text-xl font-semibold"><td colSpan={7} className="font-semibold text-gray-500 text-center text-2xl p-10">No Records To Display</td></tr>
                 ) : <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600  text-center text-xl font-semibold"><td colSpan={7} className="font-semibold text-gray-500 text-center text-2xl p-10"><span class="loading loading-bars loading-xl"></span></td></tr>}
            
      </tbody>
    </table>
  </div> 
    </>
 
  )   
}

export default EmployeeTable