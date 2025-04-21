import React, { useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5';
import Select from 'react-select'
import timeConversion from '../../../../utils/timeConversion';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { createShifts, updateShifts } from '../../../slices/shiftSlice';

const ShiftForm = ({setPopup,value}) => {

  let hasError = false;
  const option = [
    {label: 'sunday', value:'sunday'},
    {label: 'monday', value:'monday'},
    {label: 'tuesday', value:'tuesday'},  
    {label: 'wednesday', value:'wednesday'},
    {label: 'thursday', value:'thursday'},
    {label: 'friday', value:'friday'},
    {label: 'saturday', value:'saturday'}
  ];

  const options = [{label:'15 min',value:'00:15'}, {label:'30 min',value:'00:30'},{label:'45 min',value:'00:45'},{label:'1 hr',value:'01:00'}];

  const dispatch = useDispatch();
  const  [shiftData,setShiftData] = useState(value);
  let {_id,startTime,endTime,days,name,graceTime} = shiftData;
  

  const setFormData = (e)=>{
      let {name,value} = e.target;
      const updatedData = {...shiftData,[name]:value};
      setShiftData(updatedData);
      setFormError({...formError,[name]:value.length ? false:true});
  }

    
  const [formError,setFormError] = useState({
    name : false,
    startTime : false,
    endTime : false,
    days : false,
    graceTime: false
  });

const submitHandler= async (e)=>{
  try{
  const updatedError = { ...formError };
   e.preventDefault();
    // Checking for the form Validation Errors
   Object.entries(shiftData).forEach(([key,value])=>{
      if(formError[key] !==undefined && value.length == 0){
        updatedError[key] = true;
        hasError = true;
     } 
    });

    if(hasError){
      setFormError(updatedError);
      return false;
    }

    days = days.map((data)=>{
      return data.value;
    });
    startTime =  timeConversion(startTime,24);
    endTime =  timeConversion(endTime,24);

    // setShiftData((prev)=>({...prev,days}));
    const requestObj = {_id,startTime,endTime,days,name,graceTime};

    if(_id){
       const response = await dispatch(updateShifts(requestObj));
       const {message,success} = response.payload || {};
       if(success){
        toast.success(message);
       }else{
        throw new Error('Failed To Update Shift');
       }
        
    }else{
      const response = await dispatch(createShifts(requestObj));
      const {message,success} = response.payload || {};
       if(success){
        toast.success(message);
       }else{
        throw new Error('Failed To create new Shift');
       }
      
    }
    setPopup(false);
  }catch(error){
      toast.error(error.message);
  }
}


  return (
    <>
      <div className="mb-6">
        <div className="flex justify-end "><button ><IoCloseSharp onClick={()=>setPopup(false)} className="w-6 h-6 p-1 mb-1 bg-slate-300 rounded-full  translate-x-6 -translate-y-4" /></button></div>
        <div className="w-full  bg-stone-200 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">Shift Configuration</h1>
        </div>
      </div>
    <form className="mt-16">
      <div className='ps-20 pe-10'>
      <div className="grid grid-cols-3 gap-1 mb-10">
        <div className="">
          <label htmlFor="Name" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Name</label>
          <input type="text" id="Name" value={name} name="name" onChange={setFormData} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Name" />
          <p className="text-rose-500">{formError?.name ? 'Enter Shift Name':''}</p>
        </div>
        <div className=" flex flex-col items-center">
          <label htmlFor="startTime" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white text-right">Shift Start Time</label>
          <input type="time" value={startTime} id="startTime" name="startTime" onChange={setFormData} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Name" />
          <p className="text-rose-500">{formError?.startTime ? 'Enter startTime':''}</p>
        </div>
        <div className=" flex flex-col items-center">
          <label htmlFor="endTime" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Shift End Time</label>
          <input type="time" value={endTime} id="endTime" name="endTime"  onChange={setFormData} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Name" />
          <p className="text-rose-500">{formError?.endTime ? 'Enter endTime':''}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-10 mb-10">
        <div className="">
          <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Working Days</label>
          <Select
              isMulti
              name="days"
              options={option}
              value={days}
              onChange={(selectedData) => {
                setShiftData((prev) => ({
                  ...prev,
                  days: selectedData,
                }));

                // Check if any items are selected
                const hasSelection = Array.isArray(selectedData) && selectedData.length > 0;

                setFormError((prev) => ({
                  ...prev,
                  days: !hasSelection, //  set error if nothing selected
                }));
              }}
              isSearchable
              placeholder="Select The Picklist"
              className="w-2/3"
            />
           <p className="text-rose-500">{formError?.days ? 'Enter days':''}</p>
        </div>
        <div className="">
          <label htmlFor="graceTime" className="block mb-2 text-sm  text-gray-900 dark:text-white font-semibold">grace Time</label>
            <select name="graceTime" onChange={setFormData} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="">Select Option</option>
              {options.map((values) => (
                <option selected = {values.value===graceTime.trim()} key={values.value} value={values.value}>{values.label}</option>
              ))}
            </select>
            <p className="text-rose-500">{formError?.graceTime ? 'Enter graceTime':''}</p>
        </div>
      </div>
      
    </div>
    <div className="flex justify-center mt-10">
        <button className=" bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2  text-white  w-1/3 rounded" onClick={submitHandler}>{_id && 'Update' || 'Add'}</button>
      </div>
    </form>
    </>
  )
}

export default ShiftForm