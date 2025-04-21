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
        <ProfessionalForm params={obj} path="/api/employee/create/professional" method="post" buttontext="Register" className="text-white hover:bg-green-600 px-6 py-1.5 bg-emerald-500 mt-5 rounded-lg" navigation="/home/employee/employeeList"></ProfessionalForm>    
    </>
  );

}

export default ProfessionalDetailsForm