import React, { useState } from 'react'
import useGetData from '../../../hooks/useGetData';
import SearchBox from './SearchBox';
import ListData from './ListData';

const EmployeeList = () => {


  const [loaddept,deptList] = useGetData({path : '/api/configure',method:'get'});

  return (
    <>      
        <SearchBox/>
        <ListData/>
    </>
  )
}

export default EmployeeList