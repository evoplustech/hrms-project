import React from 'react'
import PersonalForm from './PersonalForm';



const PersonalDetailsForm = () => {

return (
  <>
    <PersonalForm path="/api/employee/create/personal"   method="post" button="Save & Continue" className="text-white hover:bg-green-600 px-6 py-1.5 bg-emerald-500 mt-5 rounded-lg" navigation="/home/employee/createEmployee"></PersonalForm>
  </>
)
  
}

export default PersonalDetailsForm