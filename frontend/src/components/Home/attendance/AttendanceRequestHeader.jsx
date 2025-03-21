import React from 'react'
import "react-datepicker/dist/react-datepicker.css";
import DateCalander from '../../form/DateCalander';

import toast from 'react-hot-toast';
const AttendanceRequestHeader = React.memo(({requestData,setRequestData,searchHandler,count,data}) => {
  // console.log('attendance header');
  const { role: { name } = {} } = data || {}; 
  const roles = new Set(['manager','admin','hr']);
  const {startDate,endDate,request,status} = requestData;
  const setterHandler = ({name,value})=>{
    setRequestData({...requestData,[name]:value});
  }
  const validationHandle = ()=>{
    // console.log('this is requested data',requestData);
    if(new Date(startDate) > new Date(endDate)){
      toast.error(<span>From  Date Should Not Be Smaller Than To Date</span>);
      return false;
    }
    searchHandler({});
  }

  const options = [{name:'All'},{name:'Pending'},{name:'Approved'}, {name:'Rejected'}];
  return (
    <div className="flex justify-between">
    <div className="flex space-x-4 justify-start items-center">
      {/* Search Button */}
      {/* <div className="">
        <Input type="text" name="search" placeHolder="search Request" className="pe-6 font-semibold"></Input>
        <button type="button"  className=""><FcSearch className=" w-7 h-7 transform -translate-y-14 translate-x-40" tabindex="1" /></button>
      </div> */}
      <div className="flex  h-fit mt-3">
          <label className="font-serif font-semibold">From </label>
          <DateCalander className="border-solid border-cyan-500 border-2 ms-1 text-center text-xl w-36"     timeIntervals={1} timeCaption={"Time"} dateFormat="dd/MM/yyyy" placeholderText={"dd/mm/yyyy"} selected={startDate} showMonthDropdown showYearDropdown dropdownMode="select" onChange={(date)=>setterHandler({name:'startDate',value:date})}/>
         <span className="ms-1 font-semibold">To</span>   
         <DateCalander className="border-solid border-cyan-500 border-2 text-center text-xl w-36"  name="outTime"    timeIntervals={1} timeCaption={"Time"} placeholderText={"dd/mm/yyyy"} dateFormat="dd/MM/yyyy" selected={endDate} showMonthDropdown showYearDropdown dropdownMode="select" onChange={(date)=>setterHandler({name:'endDate',value:date})}/>
      </div> 
      <div className="ps-0 w-44 flex justify-around items-center">
          <label className="font-semibold font-serif">Status:</label>
          <select name="status" value = {status} onChange = {(e)=>setterHandler(e.target)} className="py-2 px-2 hover:cursor-pointer">
            {
              options.map((value)=>( <option value={value.name} selected = {`${value.name==='All'?'selected':''}`}>{value.name}</option>))
            }
        </select>
      </div>
      {roles.has(name.toLowerCase()) &&
      <div>
      <label className="font-semibold font-serif">Request Type:</label>
        <select name="request" value={request} onChange = {(e)=>setterHandler(e.target)} className="py-2 px-2 hover:cursor-pointer">
          <option value="1" selected>My Requests</option>
          <option value="2">Other's Requests</option>
        </select>
      </div>
      }
      <div>
        <button onClick = {validationHandle} className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
            Search
        </button>
      </div>
    </div>
    <div>
      <label className="text-md font-semibold">Total Count</label>: {count}
    </div>
  </div>
   
  )
});

export default AttendanceRequestHeader