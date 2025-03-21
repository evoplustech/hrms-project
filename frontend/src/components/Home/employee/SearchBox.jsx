import React from 'react'
import { FaFilter } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { fetchAllEmployees } from '../../../slices/employeeSlice';

const SearchBox = () => {
  const dispatch = useDispatch();
  const clickHandler = async ()=>{
    await dispatch(fetchAllEmployees('/api/employee/getIncompleteRecords'));
  }

  return (
    <div className="flex justify-end space-x-8">
        <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-md px-10 py-2.5 text-center me-2 mb-2" onClick = {clickHandler}>In-Complete Profile</button>
    </div>
  )
}

export default SearchBox