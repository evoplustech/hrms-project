import React, { useEffect, useState } from 'react'
import httpRequest from '../../../../utils/httpRequest'
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin2Line } from 'react-icons/ri';
import CronPopup from './CronPopup';

const CronEditor = () => {

    const [cronData,setCronData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popup,setPopup] = useState(false);
  

    useEffect(()=>{
      const fetchApi = async ()=>{
        try{
          const {data} = await httpRequest({path:'/api/configure/cron/getAll',method:'get'});
          setCronData(data);
        }catch(error){
          console.error('Failed to fetch cron configs', error);
        }finally{
          setLoading(false);
        }
      }
    fetchApi();
    },[]);
    console.log(cronData);
    
  return (
    <>
    
      <main>
      <h1 className="font-bold text-xl text-zinc-600">Cron Configuration</h1>
      
        <div className="flex transform ms-52 mt-20">
            
              <div className="w-3/4 ">
                <div className="flex justify-between border border-x-2 ps-14 pt-4 pb-4 rounded-s-md rounded-e-md bg-gray-400"><span className="font-bold text-xl">Cron Set-up</span></div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Cron Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Duration
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        { cronData.length > 0 ? 
                    cronData.map((value)=>{
                    
                    return <>
                    { popup && <CronPopup setPopup={setPopup} popup={popup} cronData={cronData} values={value} setCronData={setCronData}></CronPopup>}
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {value.name}
                          </th>
                          <td className="px-6 py-4">
                          1
                          </td>
                          <td className="px-6 py-4">
                          {value.isActive ? 'Active' : 'In-Active'}
                          </td>
                          <td className="px-6 py-4 flex space-x-4">
                          <RiDeleteBin2Line className="cursor-pointer text-rose-500 w-7 h-7"/><FaRegEdit onClick ={()=>setPopup(!popup)}    className="cursor-pointer w-7 h-7 text-teal-600" />
                          </td>
                      </tr>
                      </>
                    }) : <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td colSpan={4} className=" px-6 py-4 text-center text-xl font-semibold">No Cron Available</td> 
                    </tr>
                    }
                            
                        </tbody>
                    </table>
                </div>
                  {/* <ul className="max-h-screen overflow-y-auto">
                    { cronData.length > 0 && 
                    cronData.map((value)=>{
                      return <li key={value._id} className="hover:bg-zinc-100 cursor-pointer flex justify-between border border-spacing-1 rounded-s-md rounded-e-md py-3 ps-4 pe-4">{value.name}<div className="flex justify-between space-x-6"><RiDeleteBin2Line className="text-rose-500 w-7 h-7"   /><FaRegEdit onClick ={()=>setPopup(!popup)} className="w-7 h-7 text-teal-600" /></div></li>
                    })
                    }
                  </ul> */}
              </div>
           
          </div>
           
      </main>
    </>
  )
}

export default CronEditor