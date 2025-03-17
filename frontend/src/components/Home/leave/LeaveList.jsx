import React, { useEffect, useState } from 'react'
import useSelectorHook from '../../../../utils/useSelectorHook'
import { LeaveLineItem } from './LeaveLineItem';
import LeaveSearch from './LeaveSearch';
import { useDispatch } from 'react-redux';
import { fetchLeaves, leaveAction } from '../../../slices/leaveSlice';
import LeavePagination from './LeavePagination';
import Pagelimit from './Pagelimit';
import { useNavigate } from 'react-router-dom';



const LeaveList = () => {
  const {data, error, status} = useSelectorHook('leave');
  const authenticate =  useSelectorHook('authenticateuser')
  const [ searchParams,setSearchParams ] = useState({status:'',AppliedStartDate:'',AppliedEndDate:'',mine:'',page:data?.page || 1,limit:data?.limit||10});
  const navigate = useNavigate()

  const userRole = authenticate.data.role.name.toLowerCase();
  const userDetail = authenticate.data

  // const userRole = authenticate;
  // console.log(authenticate)

  const dispatch = useDispatch()

  // console.log(data,error,status)

  const handleSubmit = () => {

    if(searchParams.AppliedEndDate ===''  && searchParams.AppliedStartDate === '' && searchParams.status ==='' && searchParams.mine ===''){
      alert("Need any one of the field select.");
      return false;
    }

    if((searchParams.AppliedEndDate !=='' && searchParams.AppliedStartDate === '') || (searchParams.AppliedEndDate ==='' && searchParams.AppliedStartDate !== '')){
      alert("For Datewise Search Need both dates.");
      return false;
    }
    const updateSearchParams = {...searchParams,page:1} ;
    setSearchParams(updateSearchParams);
    dispatch(fetchLeaves(updateSearchParams));
  }

  const prevPage = (page) => {
    const updateParams = {...searchParams, 'page' :page}
    setSearchParams(updateParams)
    dispatch(fetchLeaves(updateParams))

  }

  const nextPage = (page) => {
    const updateParams = {...searchParams, ['page'] :page}
    setSearchParams(updateParams)
    dispatch(fetchLeaves(updateParams))
  }

  const handlePageLimit = (e) =>{
    // if(e.target.value > data?.totalRecord) {
    //   alert("Total Record size is less that page limit.");
    //   return false;
    // }
    const updateParams = {...searchParams,limit:e.target.value, page:1}
    setSearchParams(updateParams)
    dispatch(fetchLeaves(updateParams))
    
  }

  const handleAction = (action,leave) => {

    const leaveId = leave.leaveId

    if(userDetail._id === leaveId.employeeID && action !== 'Cancelled'){
      alert(`You are now allowed to ${action} your own Leave`)
      return false;
    }

    if( leave.leaveStatus === 'Cancelled' && action === 'Rejected' ){
      alert(`Already Leave is Cancelled so you can't Reject it.`)
      return false;
    }

    if(leave.leaveStatus === action){
      alert(`The Leave status is alreday ${action} so can't proceed now.`);
      return false;
    }

    dispatch(leaveAction({leaveId,action}))
    // dispatch(leaveAction({leaveId:'',action}))
    
  }
 
  if(status !== 'fulfilled'){
    return (<div><p>Loading.....</p></div>)
  }

  if(error){
    return (<div><p>Unable to fetch the Leave Details Kindly contact your admin</p></div>)
  }
  
  return (<>
      <div className="text-lg font-bold">
        <h1 className="text-2xl">LeaveList Module</h1>
      </div>
      <div className="overflow-x-auto">
        <div className='flex flex-row my-4 justify-between items-end'>
          <div>
            <LeaveSearch userRole={userRole} setSearchParams={setSearchParams} searchParams = {searchParams} handleSubmit={handleSubmit} />
          </div>
          <div className='px-2'><span className='font-semibold'>TotalRecords:</span> {data.totalRecord}</div>
        </div>
       
        <table className="table-auto border-collapse">
          <thead>
            <tr className="bg-[#7fe0bb] text-white">
              <th className="py-3 px-6 border-b text-left">Name</th>
              <th className="py-3 px-6 border-b text-left">Leave Type</th>
              <th className="py-3 px-6 border-b text-left">Start Date</th>
              <th className="py-3 px-6 border-b text-left">End Date</th>
              <th className="py-3 px-6 border-b text-left">Number of Days</th>
              <th className="py-3 px-6 border-b text-left">Leave Reason</th>
              <th className="py-3 px-6 border-b text-left">Leave Status</th>
              <th className="py-3 px-6 border-b text-left">Approved By</th>
              <th className="py-3 px-6 border-b text-left">Applied On</th>
              <th className="py-3 px-6 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>

            {data.records?.length ? data.records.map((leave)=>{
              return (<>
                <LeaveLineItem  key={leave.leaveId} leave={leave} userDetail={userDetail} handleAction={handleAction} />
              </>)
            }):<tr><td className='text-center border p-4 border-gray-300' colSpan='10'>No Records Found</td></tr>}

        </tbody>
        </table>
        <div className='flex flex-row justify-between my-2'>
          <div><Pagelimit searchParams={searchParams} handlePageLimit={handlePageLimit} /></div>
          <div><LeavePagination searchParams = { searchParams } limit = {data?.limit} page = {data?.page} totalRecord = {data?.totalRecord} prevPage={prevPage} nextPage={nextPage} /></div>
        </div>
      </div>
  </>)
}

export default LeaveList