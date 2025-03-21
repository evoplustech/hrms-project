import React, { useState } from 'react'
import { List, ListItem, Card, CardContent, Typography } from '@mui/material';
import Input from '../../form/Input';
import ListData from '../employee/ListData';
import { IoGrid } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import EmployeeGrid from '../employee/EmployeeGrid';

const AllAttendance = () => {
  const [active,setActive] = useState('grid');
  return (
  <>
    <div className="flex flex-row space-y-2  ">
      <h1 className="text-xl font-semibold w-3/5  justify-center">All Employees</h1>
      
      <div className="flex justify-center space-x-4">
      <button type="button" className="text-center align-middle" onClick={()=>setActive('grid')} ><IoGrid  className={`w-7 h-7 ${active==='grid'? 'text-green-600':''}`} /></button>
      <button type="button" className="text-center align-middle" onClick={()=>setActive('list')}><FaListUl    className={`w-7 h-7 ${active!=='grid'? 'text-green-600':''}`} /></button>
      </div>
    </div>
    {
      active ==='list' ?  <ListData/> :<EmployeeGrid/>
    }
  </>
  );
}

export default AllAttendance