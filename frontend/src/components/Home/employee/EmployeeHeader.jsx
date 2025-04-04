import React from 'react'
import Input from '../../form/Input'
import useSelectorHook from '../../../../utils/useSelectorHook'
import { useDebounce } from '../../../hooks/useDebounce'

const EmployeeHeader = ({searchFilter,setsearchFilter,fetchEmployees}) => {

  const {data:department} = useSelectorHook('department');
  const {data:designation} = useSelectorHook('designation');
  const {data:authData} = useSelectorHook('authenticate');
  const {data:role} = useSelectorHook('role');
  const debounced =  useDebounce(fetchEmployees,1000);
  const setRole = new Set(['admin','hr']);
  const setterHandler = (params)=>{
  const {name,value} = params;
    if(name==='profile' && value===1){
      setsearchFilter({
        designation : "All",department:"All",status : true,role : "All",search :"",profile: value,page:1,limit:10
      })
    }else{
      setsearchFilter({...searchFilter,[name]:value});
    }
  }

  const searchHandler = (param)=>{
    const {value,name} = param;
    debounced({value,name});
    // fetchEmployees({name,value});
    setsearchFilter({...searchFilter,page:1,[name]:value})

  }

  const submitHandler = ()=>{
    fetchEmployees({});
  }
 
  return (
  <div className="flex justify-between">
    <div className="flex  md:space-x-4 justify-center items-center">
      {/* Search Button */}
      <div className="">
        <Input type="text"  name="search" onChange={(e)=>searchHandler(e.target)} value={searchFilter.search} placeHolder="Firstname/Lastname" className="ps-1 pe-1 text-xl w-48"></Input>
      </div> 
      {
      setRole.has(authData['role'].name.toLowerCase()) && 
      <>
      <div className="ps-0 flex justify-around items-center">
          <label className="font-semibold font-serif">Department:</label>
          <select name="department" value={searchFilter.department} onChange={(e)=>(setterHandler(e.target))}  className="w-fit py-2 px-2 hover:cursor-pointer">
            <option value="All">All</option>
            {
              department.length > 1 && department.map((value,key)=>(
                <option key = {key} value={value._id}>{value.name}</option>
              ))  
            }
        </select>
      </div>
      <div className="ps-0 flex justify-around items-center">
      <label className="font-semibold font-serif">Designation:</label>
        <select name="designation"  value={searchFilter.designation}  onChange = {(e)=>setterHandler(e.target)} className="py-2 px-2 hover:cursor-pointer">
        <option value="All">All</option>
            {
              designation.length > 1 && designation.filter((value)=>(value.department === searchFilter.department)).map((value,key)=>(
                <option key = {key} value={value._id}>{value.name}</option>
              ))
            }
        </select>
      </div>
      <div className="ps-0 flex justify-around items-center">
      <label className="font-semibold font-serif">Role:</label>
        <select name="role"  value={searchFilter.role}  onChange = {(e)=>setterHandler(e.target)} className="py-2 px-2 hover:cursor-pointer">
        <option value="All">All</option>
            {
              role.length > 1 && role.map((value,key)=>(
                <option key = {key} value={value._id}>{value.name}</option>
              ))  
            }
        </select>
      </div>
      
      <div className="ps-0 flex justify-around items-center">
        <label className="font-semibold font-serif">status:</label>
          <select name="status"  value={searchFilter.status}  onChange = {(e)=>setterHandler(e.target)} className="py-2 px-2 hover:cursor-pointer">
            <option value={true}>Active <span>🟢</span></option>
            <option value={false}>In-Active <span>🔴</span></option>
          </select>
        </div>
        <div className="ps-0 flex justify-around items-center">
        <label className="font-semibold font-serif">Profile:</label>
          <select name="profile" value={searchFilter.profile} onChange = {(e)=>setterHandler(e.target)} className="py-2 px-2 hover:cursor-pointer">
            <option value={0}>Complete </option>
            <option value={1}>In-Complete</option>
          </select>
        </div>
        
       
      <div>
        <button onClick = {submitHandler} className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
            Search
        </button>
      </div>
      </>}
    </div>
  </div>
  )

    
}

export default EmployeeHeader