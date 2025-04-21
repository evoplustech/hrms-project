import { Box, Modal } from '@mui/material'
import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'

const CronPopup = ({setPopup,popup,cronData,values,setCronData}) =>{

  const setterFunction = (element)=>{
   const {name,value} = element.target;
   const updatedObject = {...values,[name]:value};
   console.log('this is the opppppp',updatedObject);
   const updataCronData = cronData.filter((objValue)=>{
        return objValue._id === updatedObject._id ? updatedObject : objValue
   });
   console.log('this is theeeeeeee',updataCronData);
   setCronData(updataCronData);

  //   console.log('this is the data',name,value);
  // console.log(values,'',cronData);
    
  }

  console.log('this is the time',cronData);
  return (
    <div>
      <Modal open={popup} onClose={()=>setPopup(false)} className="modelBox">
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
          }} className="bg-lime-100"
        >
          <div className="mb-6">
            <div className="flex justify-end "><button ><IoCloseSharp onClick={()=>setPopup(false)} className="w-6 h-6 p-1 mb-1 bg-slate-300 rounded-full  translate-x-6 -translate-y-4" /></button></div>
            <div className="w-full  bg-stone-200 p-4">
                <h1 className="text-xl font-semibold text-gray-700 text-center">Cron Edit</h1>
            </div>
            <div className='grid grid-cols-3'>
                <div>
                  <label htmlFor="Name" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Cron Name</label>
                  <input type="text" id="Name" onChange={setterFunction} value={values.name} name="name"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w- p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Name" />
                  <p className="text-rose-500"></p>
                </div>
                <div>
                  <label htmlFor="Name" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Name</label>
                  <select onChange={setterFunction} name="schedule" value={values.schedule}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option>Select Time Duration</option>  
                    <option value="1">1 min</option>  
                    <option value="2">2 min</option>  
                    <option value="5">5 min</option>
                    <option value="1">1 hr</option>  
                  </select>
                </div>
                <div>
                  <label htmlFor="Name" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Status</label>
                  <input type="checkbox" onChange={setterFunction} checked={values.isActive ? true : false}  id="Name" value={values.isActive} name="isActive"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5 h-5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Name" />
                  <p className="text-rose-500"></p>
                </div>
            </div>
            <div className="flex justify-center mt-10">
              <button className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2  text-white  w-36 rounded">Update Cron</button>
            </div>
          </div>
           
          </Box>
      </Modal>
    </div>
  )
}

export default CronPopup