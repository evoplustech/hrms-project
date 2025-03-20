import React, { useState } from 'react'
import useGetData from '../../../hooks/useGetData';
import AllEmployees from './AllEmployees';

const EmployeeList = () => {


  const [loaddept,deptList] = useGetData({path : '/api/configure',method:'get'});

  return (
    <>      
      <AllEmployees/>
    </>
  )
}

export default EmployeeList