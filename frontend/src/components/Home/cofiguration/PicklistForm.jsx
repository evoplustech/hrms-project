import React, { useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import useSelectorHook from '../../../../utils/useSelectorHook';
import { createDepartment, updateDepartment } from '../../../slices/departmentSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { createDesignation, updateDesignation } from '../../../slices/designationSlice';
import { createReasons, updateReasons } from '../../../slices/reasonSlice';
import { createRole, updateRole } from '../../../slices/roleSlice';

const PicklistForm = ({selectedOption,setPopup,value={}}) => {
    const errorObject = {}
    const {label,value : picklistType} = selectedOption;
    if(picklistType == 'designation'){
      errorObject.name=false;errorObject.department = false;
    } else{
      errorObject.name = false;
    }
    const {data : departments} = useSelectorHook('department'); 
    const [formData,setFormData] = useState(value || {_id:'',name:'',department:'',description:''});
    const [formError,setFormError] = useState(errorObject);
    const dispatch = useDispatch();
    const {_id='',name='',department='',description=''} = formData;
    let hasError = false;
    const setData = (e)=>{
      const {value,name} = e.target;
      let erorUpdate = {...formError};
      const updatedState = {...formData,[name]:value}
      if(formError[name] !==undefined){
        erorUpdate = {...formError,[name]:value.length ? false:true}
      }
      setFormData(updatedState);
      setFormError(erorUpdate);
    }
    let action = 'update';
    if(_id==='')
      action = 'add';
    const submitHandler = async (e)=>{
        e.preventDefault();
        try{
          const updatedError = {...formError}
          const selectAction = `${action}_${picklistType}`;
          Object.entries(formData).forEach(([key,value])=>{
            if(formError[key] !==undefined && value.length == 0){
              updatedError[key] = true;
              hasError = true;
              } 
            });
            if(hasError){
              setFormError(updatedError);
              return false;
            }
            const thunkCall = getThunkForPicklist(selectAction);
            const response = await dispatch(thunkCall);
            const {message,success} = response.payload || {};
            if(success){
              toast.success(message);
             }else{
              throw new Error('Failed To new record');
             }
             setPopup(false);
        }catch(error){
          toast.error(error.message);
        }
    }

    const getThunkForPicklist = (param)=>{
        switch(param){
          case 'add_department' : return createDepartment(formData);break;
          case 'update_department' : return updateDepartment(formData);break;
          case 'add_designation' : return createDesignation(formData);break;
          case 'update_designation' : return updateDesignation(formData);break;
          case 'add_role' : return createRole(formData);break;
          case 'update_role' : return updateRole(formData);break;
          case 'add_reason' : return createReasons(formData);break;
          case 'update_reason' : return updateReasons(formData);break;
        }
    }
  return (
    <>
  <div className="mb-6">
    <div className="flex justify-end "><button ><IoCloseSharp onClick={()=>setPopup(false)} className="w-6 h-6 p-1 mb-1 bg-slate-300 rounded-full  translate-x-6 -translate-y-4" /></button></div>
    <div className="w-full  bg-stone-200 p-4">
      <h1 className="text-xl font-semibold text-gray-700 text-center">{label} Configuration</h1>
    </div>
  </div>
  <form className="mt-16">
    <div className='ps-20 pe-10'>
      <div className={`grid ${picklistType.toLowerCase()==='reason' ? 'grid-cols-1' : 'grid-cols-2'} gap-1`}>
        {
            picklistType.toLowerCase()==='designation' && <div className="">
            <label for="Department" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Department</label>
            <select name="department"  onChange = {setData} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="">Select Department</option>
              {
                departments.length > 0 && departments.map((value)=>{
                  return <option selected = {department===value._id}  key={value._id} value={value._id} >{value.name}</option>
                })
              }
            </select>
            <p className="text-rose-500">{formError?.department ? 'enter Department Field':''}</p>
          </div>
        }
        <div className="">
          <label for="Name" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Name</label>
          <input type="text" id="Name" name="name"  onChange={setData} value={name} className={`${picklistType.toLowerCase()==="reason" ? 'w-60':'w-2/3'} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`} placeholder="Enter Name" />
          <p className="text-rose-500">{formError?.name ? 'enter Name Field':''}</p>
        </div>
        {
          (picklistType.toLowerCase()==='department' || picklistType.toLowerCase()==='role') &&        
          <div className=" ">
            <label for="Description" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Description</label>
            <input type="text" id="description" value={description} name="description" onChange={setData} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter description"  />
          </div>
        }
        
      </div>     
    </div>
    <div className="flex justify-center mt-10">
        <button onClick = {submitHandler} className=" bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2  text-white  w-1/3 rounded">{action}</button>
      </div>
  </form>
  </>
  )
}

export default PicklistForm