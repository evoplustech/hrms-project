import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import PersonalForm from './PersonalForm';
import useSelectorHook from '../../../../utils/useSelectorHook';
import { ImOffice } from "react-icons/im";
import ProfessionalForm from './ProfessionalForm';

const UpdateEmployee = () => {

 const navigate =  useNavigate();
 const {empObj} = useParams();
 const {data} = useSelectorHook('employee');
 const [btnState,setState] = useState(localStorage.getItem('employeeTab')||'personal');
 let empPersonalId='';


       
 if(btnState==='personal'){
  empPersonalId = data.find((value)=>{
    return value['empPersonalId'] ? (value['empPersonalId']._id===empObj) : (value._id===empObj);
  });
  console.log('personalpersonalpersonalpersonalpersonal');
 }else{
  empPersonalId = data.find((value)=>(value._id===empObj));
  console.log('professionalprofessionalprofessional');
 }
 
 const formHandler = (params)=>{
    let id = '';
    let path='/home/employee/updateEmployee';
    if(params==='personal')
      id = empPersonalId['empPersonalId']? empPersonalId['empPersonalId']._id : empPersonalId._id;
    else
      id = empPersonalId._id;
      
    localStorage.setItem('employeeTab',params);
    setState(params);
    if(!empPersonalId['empPersonalId']){
      path = '/home/employee/createEmployee';
      localStorage.removeItem('employeeTab');
    }
     

    const navLink = `${path}/${id}`;
    navigate(navLink);
 }
  return (
    <>
      <div className="flex flex-row justify-end items-end rounded-md shadow-sm me-1 p-6" >
        <button onClick = {()=>formHandler('personal')} type="button" className={` ${btnState==='personal' ? ' ring-2 ring-gray-500  bg-gray-900 text-white':''} border border-gray-900 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900   rounded-s-lg hover:bg-gray-900 hover:text-white  dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700`}>
          <svg className="w-7 h-7 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
          </svg>
          Personal Details
        </button>
        <button  onClick = {()=>formHandler('professional')} type="button" className={` ${btnState==='professional' ? ' ring-2 ring-gray-500  bg-gray-900 text-white':''} border border-gray-900 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900   rounded-e-lg hover:bg-gray-900 hover:text-white  dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700`}>
        <ImOffice className="w-7 h-7 me-2"/>
          Professional Detail
        </button> <hr></hr>
      </div>
      {
        btnState==='personal' ? <PersonalForm params = {!empPersonalId.empPersonalId ? empPersonalId : empPersonalId.empPersonalId } path={`/api/employee/update/personal/${empObj}`}  method='put' button ='Update Details' className = {`text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`} />: 
        <ProfessionalForm params = {empPersonalId} path={`/api/employee/update/professional/${empObj}`}  method='put' buttontext ='Update Details' className = {`text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`}/>
      }
    </>
  )
}

export default UpdateEmployee;