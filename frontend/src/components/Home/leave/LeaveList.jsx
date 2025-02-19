import React from 'react'
import useSelectorHook from '../../../../utils/useSelectorHook'

const LeaveList = () => {
  const {data,error,status} = useSelectorHook('leave');
  const authenticate =  useSelectorHook('authenticateuser')
  // console.log({data,error,status});
  const userRole = authenticate.data.role.name.toLowerCase();


  return (
    <div className="w-4/5 m-auto p-6 bg-red-300">LeaveList Module</div>
  )
}

export default LeaveList