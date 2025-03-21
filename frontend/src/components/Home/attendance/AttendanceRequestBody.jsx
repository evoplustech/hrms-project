import React, { useState } from 'react'
import { PiNotePencilDuotone } from "react-icons/pi";
import AttendanceRequestActions from './AttendanceRequestActions';
import { format } from 'date-fns';


const AttendanceRequestBody = ({attendanceState,name}) => {
  const [popup,setpopup] = useState(false);
  const [record,setRecord] = useState({});
  

  // console.log('attendance body',attendanceState);
  const Heading = ['Date','Employee Name','Requested Date','In-Time','Out-Time','Status','Action'];
  const bgcolor = {'Rejected' : "bg-rose-400",'Pending':"bg-sky-400",'Approved':"bg-lime-400"}
  return (
    <>  
      {attendanceState.length > 0 && <AttendanceRequestActions popup={popup} setpopup={setpopup} record={record}></AttendanceRequestActions>}
     
      <div className="mt-8">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className='bg-stone-300'>
                {
                  Heading.map((value)=>{
                    return <th key={value} scope="col" className="px-6 py-3 text-slate-600 text-lg font-serif font-bold">
                        {value}
                    </th>
                  })
                }
              </tr>
          </thead>
          <tbody>
          {
            attendanceState.length > 0 && 
            attendanceState.map((value,keys)=>{
                return (<tr key={keys}  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600  text-center text-md font-semibold">
                  <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {format(new Date(value.createdAt),'dd-MM-yyyy')}
                  </td>
                  <td className="px-6 py-4">
                      {`${value['empPersonalId'].firstName} ${value['empPersonalId'].lastName}`}
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(value.date),'dd-MM-yyyy')}
                  </td>
                  <td className="px-6 py-4">
                      {value.inTime || ''}
                  </td>
                  <td className="px-6 py-4">
                    {value.outTime || ''}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`p-2 rounded-md ${bgcolor[value.status]} text-black`}>{value.status || ''}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={()=>(setRecord(value),setpopup(!popup))} data-modal-target="select-modal" data-modal-toggle="select-modal" ><PiNotePencilDuotone className="w-7 h-7 text-pink-400"/></button>
                  </td>
                </tr>)
            })
              ||  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600  text-center text-xl font-semibold"><td colSpan={7} className="font-semibold text-gray-500 text-center text-2xl p-10">No Records To Display</td></tr>
          }
          </tbody>
        </table>
      </div>  
    </>
  )
};

export default AttendanceRequestBody