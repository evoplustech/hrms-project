import React, { useCallback, useState } from 'react'
import currentMonthDates from '../../../../utils/dateOfMonth'
import AttendanceRequestHeader from './AttendanceRequestHeader'
import AttendanceRequestBody from './AttendanceRequestBody'
import AttendancePagination from './AttendancePagination'
import { useDispatch } from 'react-redux'
import { getAttendanceRequest } from '../../../slices/attendanceRequestSlice'
import useSelectorHook from '../../../../utils/useSelectorHook';
import toast from 'react-hot-toast'


const AttendanceRequest = () => {
  const [date1,date2] = currentMonthDates();
  const [requestData,setRequestData] = useState({startDate:date1,endDate:date2,request:1,status:'All',page:1,limit:1});
  const dispatch = useDispatch();
  const {data} = useSelectorHook("authenticate");
  const {data : attendanceState,count} = useSelectorHook("attendancerequest");
  const totalPages = Math.ceil(count/requestData.limit || 0);
  const searchHandler = async({name='',value=''})=>{
    try{
      let {startDate,endDate,request,status,page,limit} = requestData;
      if(name==='page'){
        page = value;
      }else if(name==='limit'){
        limit = value;
        page=1;
      }
      const url = `/api/attendance/getRequest?empid=${data["empPersonalId"]._id}&id=${data.employeeId}&startDate=${startDate}&endDate=${endDate}&status=${status}&requestType=${request}&page=${page}&limit=${limit}`;
      console.log(url);
      await dispatch(getAttendanceRequest(url));
    }catch(error){
      toast.error(error.message);
    }
  }
  return (
    <>
      <main className="flex flex-col">
          <AttendanceRequestHeader data={data} requestData={requestData} setRequestData={setRequestData} count={count}  searchHandler={searchHandler}></AttendanceRequestHeader>
          <AttendanceRequestBody  attendanceState={attendanceState} ></AttendanceRequestBody>
          <AttendancePagination count={count}  totalPages={totalPages} requestData={requestData} setRequestData={setRequestData} searchHandler={searchHandler}></AttendancePagination>
      </main>
    </>
  )
}

export default AttendanceRequest