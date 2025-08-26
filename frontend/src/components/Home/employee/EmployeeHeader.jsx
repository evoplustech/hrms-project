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
  const fields = new Set(['department','designation','role','status']);
  console.log('this is the search filter ',searchFilter.designation);

  const setterHandler = (params)=>{
    try{
      const {name,value} = params;
      const searchObject = {...searchFilter,[name]:value,filter:1};
      if(name==='profile' && value==='1'){
        searchObject.designation = "All";
        searchObject.department="All";
        searchObject.status= true;
        searchObject.role="All";
        searchObject.search ="";
        // searchObject.page=1;
        // searchObject.limit=10;
        // searchObject.filter=1;
      }else if(fields.has(name.toLowerCase())){
        // searchObject.page=1;
        // searchObject.filter=1;
        if(name==='department'){
          searchObject.designation="All";
        }
      }
      setsearchFilter(searchObject);
    }catch(error){
      console.log(`Error : ${error.message}`);
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
    setsearchFilter({...searchFilter,filter:0,page:1});
  }
 
  return (
  <div className="flex justify-between">
    <div className="flex  md:space-x-4 justify-center items-center">
      {/* Search Button */}
      <div className="text-sm">
        <Input type="text"  name="search" onChange={(e)=>searchHandler(e.target)} value={searchFilter.search} placeholder="Firstname/Lastname" className="ps-1 pe-1 text-sm w-48"></Input>
      </div> 
      {
      setRole.has(authData['role'].name.toLowerCase()) && 
      <>
      <div className="ps-0 flex justify-around items-center">
          <label className="font-semibold text-sm">Department:</label>
          <select name="department" value={searchFilter.department} onChange={(e)=>(setterHandler(e.target))}  className="ml-2 py-2 px-2 hover:cursor-pointer text-sm">
            <option value="All">All</option>
            {
              department.length > 1 && department.map((value,key)=>(
                <option key = {key} value={value._id}>{value.name}</option>
              ))  
            }
        </select>
      </div>
      <div className="ps-0 flex justify-around items-center">
      <label className="font-semibold text-sm">Designation:</label>
        <select name="designation"  value={searchFilter.designation}  onChange = {(e)=>setterHandler(e.target)} className="py-2 ml-2 px-2 hover:cursor-pointer text-sm">
        <option value="All" >All</option>
            {
              designation.length > 1 && designation.filter((value)=>(value.department === searchFilter.department)).map((value,key)=>(
                <option key = {key} value={value._id}>{value.name}</option>
              ))
            }
        </select>
      </div>
      
      <div className="ps-0 flex justify-around items-center">
      <label className="font-semibold text-sm">Role:</label>
        <select name="role"  value={searchFilter.role}  onChange = {(e)=>setterHandler(e.target)} className="py-2 px-2 hover:cursor-pointer text-sm ml-2">
        <option className='text-sm' value="All">All</option>
            {
              role.length > 1 && role.map((value,key)=>(
                <option key = {key} value={value._id}>{value.name}</option>
              ))  
            }
        </select>
      </div>
      
      <div className="ps-0 flex justify-around items-center">
        <label className="font-semibold text-sm">Status:</label>
          <select name="status"  value={searchFilter.status}  onChange = {(e)=>setterHandler(e.target)} className="py-2 text-sm ml-2 px-2 hover:cursor-pointer w-2/3">
            <option value={true}>Active <span>🟢</span></option>
            <option value={false}>In-Active <span>🔴</span></option>
          </select>
        </div>
        <div className="ps-0 flex justify-around items-center">
        <label className="font-semibold text-sm">Profile:</label>
          <select name="profile" value={searchFilter.profile} onChange = {(e)=>setterHandler(e.target)} className="py-2 ml-2 text-sm px-2 hover:cursor-pointer">
            <option value={0}>Complete </option>
            <option value={1}>In-Complete</option>
          </select>
        </div>
        
       
      <div>
        <button onClick = {submitHandler} className="px-6 py-2 bg-emerald-500 text-white duration-400 text-sm w-full">
            Search
        </button>
      </div>
      </>}
    </div>
  </div>
  )

    
}

export default EmployeeHeader