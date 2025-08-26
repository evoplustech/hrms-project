import { Box, Modal } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { IoCloseSharp } from 'react-icons/io5'
import httpRequest from '../../../../utils/httpRequest';

const CronPopup = ({setPopup,popup,cronData,values,setCronData}) =>{

  const [error,setError] = useState({name:false,schedule:false});
  const updateError = {...error};
  let checkError = false;

  // form field state update function
  const setterFunction = (element)=>{
   let {name,value} = element.target;
   if(name==='isActive'){
    value = element.target.checked;
   }      
   if(error[name] !==undefined){
    const errorValue =value.length <= 0 ? true:false;
    setError({...error,[name]:errorValue});
   }
   const updatedObject = {...values,[name]:value};
   const updataCronData = cronData.map((objValue)=>{
        return objValue._id === updatedObject._id ? updatedObject : objValue
   });
   setCronData(updataCronData);
  }

  //form submit handler function
  const submitHandler = async()=>{
    try{
      Object.entries(values).forEach(([name,value])=>{
        console.log('name',name);
        if(error[name] !==undefined && value.length===0){
          updateError[name] = true; 
          checkError = true;
        }
      })
      if(checkError){
        setError(updateError);
        return false;
      }

      const response = await httpRequest({path:'/api/configure/cron/update',data:values,method:'put',params:values._id});
      
      if(response.success){
        toast.success(response.message);
      }
      
      setPopup(false);
    }catch(error){

    }finally{
      
    }
  }
console.log(error.name ,'||||||||||',error.schedule);

  return (
    <div>
      <Modal open={popup} onClose={()=>setPopup(true)} className="modelBox">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: '65%', // Set desired width
            height: 'auto', // Set desired height,
          }} className="bg-white"
        >
          <div className="mb-6">
            <div className="flex justify-end "><button disabled={`${ error.name? 'disabled':''}`}><IoCloseSharp onClick={()=>setPopup(false)} className="w-6 h-6 p-1 mb-1 bg-slate-300 rounded-full  translate-x-6 -translate-y-4" /></button></div>
            <div className="w-full mb-6">
                <h1 className="text-xl font-semibold text-gray-700 text-center">{error.name}Cron Edit</h1>
            </div>
            <div className="grid grid-cols-3 w-2/3 cron-p">
                <div>
                  <label htmlFor="Name" className="block mb-2 text-base font-semibold text-gray-900 dark:text-white">Cron Name</label>
                  <input type="text" id="Name" onChange={setterFunction} value={values.name} name="name"  className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w- p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Name" />
                  <p className="text-rose-500">{error.name ? 'Enter Name' :''}</p>
                </div>
                <div>
                  <label htmlFor="Name" className="block mb-2 text-base font-semibold text-gray-900 dark:text-white">Name</label>
                  <select onChange={setterFunction} name="schedule" value={values.schedule}  className="bg-gray-50 border cron-s border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full">
                    <option value="">Select Time Duration</option>  
                    <option value="1">1 min</option>  
                    <option value="15">15 min</option>  
                    <option value="30">30 min</option>
                    <option value="45">45 min</option> 
                    <option value="60">1 hr</option> 
                    <option value="120">2 hr</option>
                    <option value="180">3 hr</option>
                  </select>
                  <p className="text-rose-500">{error.schedule ? 'Enter ScheduleTime' :''}</p>
                </div>
                <div>
                  <label htmlFor="Name" className="block mb-2 text-base font-semibold text-gray-900 dark:text-white ml-3">Status</label>
                  <input type="checkbox" onChange={setterFunction} checked={values.isActive ? true : false}  id="Name" value={values.isActive} name="isActive"  className="bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5 h-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 ml-3 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Name" />
                </div>
            </div>
            <div className="flex justify-center mt-10">
              <button className="text-white hover:bg-green-600 px-6 py-1.5 bg-emerald-500 rounded-lg" onClick = {submitHandler}>Update Cron</button>
            </div>
          </div>
           
          </Box>
      </Modal>
    </div>
  )
}

export default CronPopup