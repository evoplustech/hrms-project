import React, { useState } from 'react'
import useSelectorHook from '../../../../utils/useSelectorHook';
import GridView from './GridView';
import Input from '../../form/Input';
import { Link } from 'react-router-dom';

const EmployeeGrid = () => {

  const employeeList = useSelectorHook('employee');
  const activeEmp = employeeList["data"].filter((value)=> value.empPersonalId );
  const [employee,setEmployee] = useState(activeEmp || []);
  const [pageNo,setPageNo] = useState(1);
  // const emp_active='';
  const limit = 15;
  let i= 0;
  const pageCount = Math.ceil(activeEmp.length/limit);
  const pageArray = Array(pageCount);

  const pageHandler= (param)=>{
    try{
      setPageNo(param);
      const records = [];
      const startKey = (param-1)*limit;
      console.log('page number',param,'startKey',startKey);
        for(let i=startKey;i< startKey+limit;i++){
          if(activeEmp[i] === undefined)
            break;  
          records.push(activeEmp[i]);
        }
      setEmployee(records);
    console.log('this is the employee records',records);
    // const empRecords = employeeList["data"].filter((value)=> value.empPersonalId );
    }catch(error){
      console.log(`Error ${error.message}`);
    }
  }

  const searchHandler = (searchData)=>{
    const searchResult =  activeEmp.filter((value)=>{
      let fname =  value['empPersonalId'].firstName.toLowerCase();
      let lname =  value['empPersonalId'].lastName.toLowerCase();
      let dept =  value['department'].name.toLowerCase();
      return fname.includes(searchData) || lname.includes(searchData) || dept.includes(searchData);
    })
   
    setEmployee(searchResult);
  }

  return (
    <>
      <div className="">
          <Input type="text"  name="searchBox" onChange = {(e)=>(searchHandler(e.target.value))} placeholder="Search Here" />
      </div>
        <div className="grid md:grid-cols-3 grid-cols-2 mt-2 space-y-4 ">
            {
              employee.map((value)=>{
                i++;
                  if(i>15){
                    return null;
                  }
                  return <GridView key={value._id} employeeId={value.employeeId} name={`${value['empPersonalId'].firstName} ${value['empPersonalId'].lastName}`} email = {value.email} department={value['department'].name} designation={value['designation'].name} pic={value['empPersonalId'].profilepic}/>
              })
            }
        </div>
        <div className="mt-11 flex justify-end">
          <nav aria-label="Page navigation example">
            <ul className="flex items-center -space-x-px h-10 text-base">
              {
                pageNo > 1 && <li>
                <button href="#" onClick ={()=>pageHandler(pageNo-1)} className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>
                  <span className="sr-only">Previous</span>
                  <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                  </svg>
                </button>
              </li>
              }
              {
                pageArray.fill(0).map((value,key)=>{
                  const no = key+1;
                  return (<li>
                    <button onClick={()=>pageHandler(no)}  href="#" className={`${pageNo===no ? 'bg-blue-400':'bg-white'} flex items-center justify-center px-4 h-10 leading-tight text-gray-500  border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>{no}</button>
                  </li>)
                })
                
              }
              {
                pageNo < pageArray.length  && 
                <li>
                  <button href="#" onClick ={()=>pageHandler(pageNo+1)} className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>
                    <span className="sr-only">Next</span>
                    <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                  </button>
                </li>
              }
            </ul>
          </nav>
        </div>
    </>
  )
}

export default EmployeeGrid