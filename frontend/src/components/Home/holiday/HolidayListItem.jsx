import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserRole } from '../../../slices/authSlice';
import { Link } from 'react-router-dom';
import { deleteHoliday } from '../../../slices/holidaySlice';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const HolidayListItem = ({holiday,day,index}) => {
    const dispatch = useDispatch();
    const authenticateUser = useSelector(getUserRole);
    const handleDelete = (_id,name)=>{
        if(confirm(`Are you sure you want to delete the ${name} Holiday?`)){
            dispatch(deleteHoliday({_id}));
        }
    }

    return (<tr className='odd:bg-gray-100 even:bg-white'>
        <td>{index+1}</td>
        <td> {holiday.holidayDate} </td>
        <td> {holiday.holidayName} </td>
        <td> {day} </td>
        {   authenticateUser==='admin' 
            &&
            <td className='flex flex-row justify-center'>
                <MdDelete size={25} className='cursor-pointer' onClick={(e)=> handleDelete(holiday._id,holiday.holidayName)}/>
                
                <Link to={`./addholiday/${holiday._id}`} className='cursor-pointer'><FaRegEdit size={23} /></Link>
                
            </td>
        }
    </tr>)
}

export default HolidayListItem