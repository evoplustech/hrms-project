import React, { useState } from 'react'
import { format} from "date-fns"; // Import date-fns for formatting
import { FaTimesCircle, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { LiaRocketchat } from "react-icons/lia";
import AttendanceRequestPopUp from './AttendanceRequestPopUp';


const AttendanceTimesView = ({data,employeedata}) => {
  const [popup,setpopup] = useState(false);
  const [record,setRecord] = useState({});
  const color = {"week off":"text-sky-500","absent":"text-rose-500","holiday":"text-teal-500","present":"text-lime-500"}
  const Heading = ['Date',' Day Status','In Time','Out Time','Hrs Worked','Action'];
//   ,'Shift Name'
console.log('popup modal box ---->',popup);
    const popupHandler = (value)=>{
        setpopup(value)
    }
  
  return (
    <>
      <div className="relative overflow-x-auto shadow-md mt-6">
            {
            record.date  && <AttendanceRequestPopUp popup={popup} record = {record} popupHandler={popupHandler}/>
            }
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-900 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className='bg-slate-300'>
                      {
                        Heading.map((value)=>{
                          return <th key={value} scope="col" className="px-6 py-3  text-sm font-bold font-serif">
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
                        <td scope="row" className="px-6  text-sm text-gray-900 whitespace-nowrap dark:text-white font-normal">
                            {format(new Date(value.date),'dd-MM-yyyy')}
                        </td>
                        <td className="px-6 text-sm lin-he font-normal text-gray-900">
                            <span className={`${color[value.status.toLowerCase()]}`}>{value.status}</span>
                        </td>
                        {/* <td className="px-6 py-1 text-xs lin-he font-normal">
                            {employeedata['shift'].name}
                        </td> */}
                        
                        <td className="px-6 text-sm lin-he font-normal text-gray-900 tort">
                            {value.checkInTime || "00:00:00"}{value.status.toLowerCase()==='late-in' && <img src='/tortis.png'/>}
                        </td>
                        <td className="px-6  text-sm lin-he font-normal text-gray-900">
                           {value.checkOutTime || "00:00:00"}
                        </td>
                        <td className="px-6 text-sm lin-he font-normal text-gray-900">
                            {value.totalHours}
                        </td>
                        <td className="px-6 text-left text-sm font-normal text-gray-900">
                           
                        {
                            
                            value.status.toLowerCase() !=='present' &&( 
                                value?.related?.status ==='Pending' ?  <img src='/pen.png'/> : value?.related?.status==='Rejected' ? <img src='/rej.png'/> : value?.related?.status ==='Approved' ? <img src='/app.png'/>:  <span className="cursor-pointer"><button onClick={()=>(setRecord(value),popupHandler(true))}><img src='/late.png'/></button></span>)
                          }
                          
{/*                           
                          {
                            value.status.toLowerCase() !=='present' && 
                                value?.related?.status ==='Pending' ?  <img src='/req.png'/> : value?.related?.status==='Rejected' ?  <img src='/req.png'/> : value?.related?.status ==='Approved' ?  <img src='/req.png'/>:  <span className="cursor-pointer"><button onClick={()=>(setRecord(value),popupHandler(true))}> <img src='/req.png'/></button></span>
                          } */}
                            {/* <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a> */}
                        </td>
                      </tr>)
                    }) ||

                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td colSpan={7} className="font-semibold text-gray-500 text-center text-xl p-10 ">No Records To Display</td>
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