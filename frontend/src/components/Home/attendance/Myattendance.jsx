import React, { useState } from 'react'
import { IoCalendarNumberSharp } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, formatDate } from "date-fns"; // Import date-fns for formatting
import AttendanceTimesView from './AttendanceTimesView';
import httpRequest from '../../../../utils/httpRequest';
import useSelectorHook from '../../../../utils/useSelectorHook';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchAttendance } from '../../../slices/attendanceSlice';

const Myattendance = () => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calander,setCalander] = useState(false);
    const {data} = useSelectorHook("attendance");
    const dispatch = useDispatch();
    const {id} = useParams();
    const {data:employeeDetails}  = useSelectorHook('employee');
    let {data:employeedata}  = useSelectorHook('authenticate');
    console.log('params',id,employeedata,'id type',typeof id,typeof employeedata['employeeId']);

  if(id !== employeedata['employeeId'])
    employeedata = employeeDetails.length > 0 && employeeDetails.find((value)=>value.employeeId === id);


    const handleDateChange = async (dateParam) => {
      try{
        if(data.length > 0){
          const dbAttendanceDate = new Date(data[0].date);
          const selectedDate = new Date(dateParam);
          if(dbAttendanceDate.getMonth() !== selectedDate.getMonth())
            await dispatch(fetchAttendance({id,dateParam}));
        }else{
            await dispatch(fetchAttendance({id,dateParam}));
        }
        setSelectedDate(dateParam);
        setCalander(false); 
      }catch(error){
        console.log(error.message);
      }
    };
 
    return (
      <>
      <div className="bg-slate-100 w-full box-border border-x-zinc-300">
        <div className="relative flex justify-between items-center">
            <p className="flex justify-start items-start text-2xl font-semibold text-slate-700 ms-2">Attendance History</p>
            <div className="flex justify-end items-end space-x-6 relative">
              <input type="text" value={format(selectedDate,"dd/MM/yyyy")} name="floating_last_name" id="floating_last_name" className="w-20 block py-2.5 px-0  text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <IoCalendarNumberSharp onClick={()=>setCalander(!calander)} className="w-12 h-12 text-emerald-400 cursor-pointer " />
            </div>
        </div>
        <div className="space-y-4 mt-2 ms-2">
        <div className="flex  justify-start items-center"><span className="font-bold text-xl text-slate-500">Employee Name : </span><p className="font-semibold text-xl ms-2 text-teal-700">{`${employeedata['empPersonalId'].firstName} ${employeedata['empPersonalId'].lastName}`}</p></div>
        <div className="flex  justify-start items-center"><span className="font-bold text-xl text-slate-500">Employee Id : </span><p className="font-semibold text-xl ms-2 text-teal-700">{`${employeedata.employeeId}`}</p></div>
        </div>
        <div className="flex justify-end relative">
            {
            calander && <div className="fixed z-50 transform -translate-y-20"><DatePicker
            
            selected={new Date(selectedDate)}
            onChange={handleDateChange}
            showMonthDropdown  // Show month dropdown
            showYearDropdown  // Show year dropdown
            dropdownMode="select" 
            dateFormat="dd/MM/yyyy" // Custom date format
            inline  // Makes the calendar always visible (optional, you can remove if you want a pop-up style)
          /></div>
            }
        </div>

        {/* Table Content */}
            <AttendanceTimesView data={data} employeedata={employeedata}/>
      </div>
      </>
    )
}
      
     


export default Myattendance