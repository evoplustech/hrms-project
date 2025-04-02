import React, { useState } from 'react'
import { List, ListItem, Card, CardContent, Typography } from '@mui/material';
import Input from '../../form/Input';
import ListData from '../employee/ListData';
import { IoGrid } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import EmployeeGrid from '../employee/EmployeeGrid';
import EmployeeHeader from '../employee/EmployeeHeader';
import useSelectorHook from '../../../../utils/useSelectorHook';
import { useDispatch } from 'react-redux';
import EmployeePagination from '../employee/EmployeePagination';
import { fetchAllEmployees } from '../../../slices/employeeSlice';

const AllAttendance = () => {
  // const [active,setActive] = useState('grid');

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
      const response = await dispatch(fetchAllEmployees(updatedParams));
    }catch(error){
      console.log(error.message);
    } 
  }

  return (
  <>
    {/* <div className="flex flex-row space-y-2  ">
      <h1 className="text-xl font-semibold w-3/5  justify-center">All Employees</h1>
      
      <div className="flex justify-center space-x-4">
      <button type="button" className="text-center align-middle" onClick={()=>setActive('grid')} ><IoGrid  className={`w-7 h-7 ${active==='grid'? 'text-green-600':''}`} /></button>
      <button type="button" className="text-center align-middle" onClick={()=>setActive('list')}><FaListUl    className={`w-7 h-7 ${active!=='grid'? 'text-green-600':''}`} /></button>
      </div>
    </div>
    {
      active ==='list' ?  <ListData/> :<EmployeeGrid/>
    } */}
    <div>
      <EmployeeHeader searchFilter={searchFilter} setsearchFilter={setsearchFilter} fetchEmployees={fetchEmployees}></EmployeeHeader>
      <EmployeeGrid  data={data} count={count} loading = {status}></EmployeeGrid>
      <EmployeePagination searchFilter={searchFilter} setsearchFilter={setsearchFilter} fetchEmployees={fetchEmployees} totalPages={totalPages}></EmployeePagination>
    </div>

  </>
  );
}

export default AllAttendance