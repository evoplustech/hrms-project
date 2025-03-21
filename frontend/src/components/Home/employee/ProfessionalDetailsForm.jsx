import React, { useState,useRef } from 'react'
import {  useNavigate, useParams } from 'react-router-dom'
import ProfessionalForm from './ProfessionalForm.jsx';

const ProfessionalDetailsForm = () => {
  const empPersonalId={};
  console.log(empPersonalId);
  const obj={empPersonalId}
  const {id} = useParams();
  empPersonalId._id=id;
  console.log(obj);

  return (
    <>
      {/* params={},path="",method="",buttontext="",className="",navigation="" */}
        <ProfessionalForm params={obj} path="/api/employee/create/professional" method="post" buttontext="Register" className="w-40 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" navigation="/home/employee/employeeList"></ProfessionalForm>    
    </>
  );

}

export default ProfessionalDetailsForm