import React, { useState } from 'react'
import { FaRegEdit } from "react-icons/fa";
import PicklistPopup from './PicklistPopup';
import { RiDeleteBin2Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { deleteDesignation } from '../../../slices/designationSlice';
import { deleteDepartment } from '../../../slices/departmentSlice';
import { deleteReasons } from '../../../slices/reasonSlice';
import { deleteShift } from '../../../slices/shiftSlice';
import { deleteRole } from '../../../slices/roleSlice';

const PicklistData = ({selectedOption,value}) => {
  const [popup,setPopup] = useState(false);
  const {value : picklist} = selectedOption;
  const {_id} = value;
  const dispatch= useDispatch();

  const popupHandler = ()=>{
    toast(
      (t) => (
        <div>
          <p>{`Are You Sure TO Delete The ${picklist}`} </p>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => {
                toast.dismiss(t.id); // Close the toast
                deleteHandler(); // Perform the action
              }}
            >
              Confirm
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => toast.dismiss(t.id)} // Close the toast
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Keep it open until the user interacts
      }
    );
  }

  const deleteHandler = async ()=>{
    try{
        const dispatchAction = dispatchFunction(_id);
        const response = await dispatch(dispatchAction);
        console.log('this is shift reaponse',response);
        const {success,message} = response.payload;
        if(success){
          toast.success('Record Deleted Successfully');
        }else{
          throw new Error('Failed, Record Not Deleted');
        }
      
    }catch(error){
        toast.error(error.message);
    }
      
  }

  const dispatchFunction = (data)=>{
    switch(picklist.toLowerCase()){
      case 'department': return deleteDepartment(data);break;
      case 'designation': return deleteDesignation(data);break;
      case 'shift': return deleteShift(data);break;
      case 'reason': return deleteReasons(data);break;
      case 'role': return deleteRole(data);break;
    }
  }


 
  return (
    <>
      {popup && <PicklistPopup selectedOption={selectedOption} popup ={popup} setPopup={setPopup} value={value}></PicklistPopup>}
      <li className="hover:bg-zinc-100 cursor-pointer flex justify-between border border-spacing-1 rounded-s-md rounded-e-md py-3 ps-4 pe-4"><span>{value.name || ''}</span><div className="flex justify-between space-x-6"><RiDeleteBin2Line className="text-rose-500 w-7 h-7" onClick =  {popupHandler}/><FaRegEdit className="w-7 h-7 text-teal-600" onClick ={()=>setPopup(!popup)}/></div></li>
    </>
  )
}

export default PicklistData