import React, { useState } from 'react'
import ListData from './ListData'
import EmployeeHeader from './EmployeeHeader'
import EmployeeTable from './EmployeeTable'
import EmployeePagination from './EmployeePagination'
import { useDispatch } from 'react-redux'
import { fetchAllEmployees } from '../../../slices/employeeSlice'
import useSelectorHook from '../../../../utils/useSelectorHook'

const AllEmployees = () => {

  
  const {data,count,status} = useSelectorHook('employee');
  
  const dispatch = useDispatch();
  const [searchFilter,setsearchFilter] = useState ({
    designation : "All",department:"All",status : true,role : "All",search :"",profile: "0",page :1,limit:10
  });
  const totalPages = Math.ceil(count/searchFilter.limit || 0);
  const fetchEmployees = async ({name='',value=''})=>{
    try{
      const updatedParams = {...searchFilter};
      if(name==='page'){
        updatedParams.page = value;
      }else if(name==='limit'){
        updatedParams.limit = value;
        updatedParams.page=1;
      }
      if(name==="search"){
        updatedParams.search = value;
        updatedParams.page=1;
      }
      console.log('this is the request data->',updatedParams);
      const response = await dispatch(fetchAllEmployees(updatedParams));
    }catch(error){
      console.log(error.message);
    } 
  }
  return (
    // <div><ListData route = "Employee"></ListData></div>
    <div>
      <EmployeeHeader searchFilter={searchFilter} setsearchFilter={setsearchFilter} fetchEmployees={fetchEmployees}></EmployeeHeader>
      <EmployeeTable  data={data} count={count} loading = {status}></EmployeeTable>
      <EmployeePagination searchFilter={searchFilter} setsearchFilter={setsearchFilter} fetchEmployees={fetchEmployees} totalPages={totalPages}></EmployeePagination>
    </div>
  )
}

export default AllEmployees