import React, { useEffect } from 'react'
import useSelectorHook from '../../../../utils/useSelectorHook'
import { useSelector } from 'react-redux';
import { getUserRole } from '../../../slices/authSlice';
import HolidayListItem from './HolidayListItem';
import { useLocation } from 'react-router-dom';

const HolidayList = () => {
    const { data, error, status } = useSelectorHook('holiday');
    const authenticateUser = useSelector(getUserRole);
    const location = useLocation()
    useEffect(()=>{
        window.scroll(0,0);
    },[location])


    if(status.toLowerCase() === "pending"){
        return (<><p>Loading....</p></>)
    }
    if(error && error.toLowerCase() !=="no holiday records found"){
        return (<>
                <div className='w-full  py-3 px-5 rounded-lg min-h-dvh'>
                    <p className='text-3xl bg-gray-200 text-center mx-auto py-10 rounded-2xl'>{error}</p>
                </div>
        </>)
    }

  return (
    <div className='w-full py-3 px-5 rounded-lg'>
        {/* <h1 className='text-3xl font-semibold'>HolidayList</h1> */}
        <div className="overflow-x-auto border-base-content/5 bg-base-100 w-full mx-auto mt-10">
        <table className="table text-center items-center">
            <thead >
                <tr className='bg-slate-300 text-gray-700'>
                    <th className='text-sm'>SI.NO</th>
                    <th className='text-sm'>Date</th>
                    <th className='text-sm'>Festival</th>
                    <th className='text-sm'>Day</th>
                    {authenticateUser === 'admin' && <th  className='text-sm'>Action</th>}
                </tr>
            </thead>
            <tbody>
                {data.length?data.map((holiday,index) => {
                    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                    const d = new Date(holiday.holidayDate);
                    let day = weekday[d.getDay()];
                    return (<HolidayListItem key={index} index={index} holiday={holiday} day={day} />)
                }):<tr><td className='text-center' colSpan={4}>No Record Found</td></tr>}
                
            </tbody>
        </table>
        </div>
        <div></div>
    </div>
  )
}

export default HolidayList