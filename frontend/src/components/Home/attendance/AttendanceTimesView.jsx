import React, { useState } from 'react'
import { format} from "date-fns"; // Import date-fns for formatting
import { FaTimesCircle, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { LiaRocketchat } from "react-icons/lia";
import AttendanceRequestPopUp from './AttendanceRequestPopUp';


const AttendanceTimesView = ({data,employeedata}) => {
  const [popup,setpopup] = useState(false);
  const [record,setRecord] = useState({});
  const color = {"week off":"text-sky-500","absent":"text-rose-500","holiday":"text-teal-500","present":"text-lime-500"}
  const Heading = ['Date',' Day Status','Shift Name','In Time','Out Time','Hrs Worked','Action'];

    const popupHandler = (value)=>{
        setpopup(value)
    }
  
  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-24">
            {
            record.date  && <AttendanceRequestPopUp popup={popup} record = {record} popupHandler={popupHandler}/>
            }
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className='bg-slate-300'>
                      {
                        Heading.map((value)=>{
                          return <th key={value} scope="col" className="px-6 py-3  text-xl font-bold font-serif">
                              {value}
                          </th>
                        })
                      }
                    </tr>
                </thead>
                <tbody>
                  {
                  data.length > 0 &&  data.map((value)=>{
                     return  (<tr key={value.date} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600  text-xl font-semibold">
                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {format(new Date(value.date),'dd-MM-yyyy')}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`${color[value.status.toLowerCase()]}`}>{value.status}</span>
                        </td>
                        <td className="px-6 py-4">
                            {employeedata['shift'].name}
                        </td>
                        
                        <td className="px-6 py-4">
                            {value.checkInTime || "00:00:00"}{value.status.toLowerCase()==='late-in' && <span className="text-2xl ml-3">🐌</span>}
                        </td>
                        <td className="px-6 py-4">
                           {value.checkOutTime || "00:00:00"}
                        </td>
                        <td className="px-6 py-4">
                            {value.totalHours}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {
                            value.status.toLowerCase() !=='present' && 
                                value?.related?.status ==='Pending' ? <FaHourglassHalf  className="w-8 h-8 text-yellow-700 translate-x-12"></FaHourglassHalf> : value?.related?.status==='Rejected' ? <FaTimesCircle className="w-8 h-8 text-orange-600 translate-x-12"></FaTimesCircle> : value?.related?.status ==='Approved' ? <FaCheckCircle className="w-8 h-8 text-green-500 translate-x-12"></FaCheckCircle>:  <span className="cursor-pointer"><button onClick={()=>(setRecord(value),popupHandler(true))}><LiaRocketchat  className="w-12 h-12 text-cyan-400"/></button></span>
                          }
                            {/* <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a> */}
                        </td>
                      </tr>)
                    }) ||

                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td colSpan={7} className="font-semibold text-gray-500 text-center text-2xl p-10">No Records To Display</td>
                    </tr>
                  }
                    {/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Microsoft Surface Pro
                        </th>
                        <td className="px-6 py-4">
                            White
                        </td>
                        <td className="px-6 py-4">
                            Laptop PC
                        </td>
                        <td className="px-6 py-4">
                            $1999
                        </td>
                        <td className="px-6 py-4 text-right">
                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                        </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            Magic Mouse 2
                        </th>
                        <td className="px-6 py-4">
                            Black
                        </td>
                        <td className="px-6 py-4">
                            Accessories
                        </td>
                        <td className="px-6 py-4">
                            $99
                        </td>
                        <td className="px-6 py-4 text-right">
                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                        </td>
                    </tr> */}
                </tbody>
            </table>
        </div>
    </>
  )
}

export default AttendanceTimesView