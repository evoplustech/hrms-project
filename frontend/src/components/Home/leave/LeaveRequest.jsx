import React, { useState } from 'react'
import useSelectorHook from '../../../../utils/useSelectorHook'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { applyLeave } from '../../../slices/leaveSlice';
import toast from 'react-hot-toast';

const LeaveRequest = () => {
  const { data, error, status } = useSelectorHook('leaveType');
  // console.log( { data, error, status } )
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticateUser = useSelectorHook('authenticate')
  const [leaveForm,setLeaveForm] = useState({leaveTypeId:"", startDate:"", startDatetype:"", endDate:"", endDatetype:"", reason:"" })

  const handleChange = (e) => {
    const {name,value} = e.target;
    setLeaveForm({ ...leaveForm, [name]:value })
  }

  const handleApplyLeave = async () => {
    if(leaveForm.leaveTypeId === '' || leaveForm.startDate ==='' || leaveForm.startDatetype === '' || leaveForm.endDate ==='' || leaveForm.endDatetype === '' || leaveForm.reason === ''){
      alert("All the Field must be filled");
      return false;
    }
    if(leaveForm.startDate > leaveForm.endDate){
      alert("Start Date Must be same or less than end Date")
      return false;
    }
    if(leaveForm.startDate === leaveForm.endDate){
      if(leaveForm.startDatetype !== leaveForm.endDatetype){
        alert("Start and End date is same then it's BreakDown also need to be same.");
        return false;
      }
    }

    const leaveParams = {...leaveForm,employeeId:authenticateUser.data._id};
    
    if(!compareDates(leaveParams.startDate,leaveParams.endDate, leaveParams.startDatetype, leaveParams.endDatetype)){
      return false;
    }

    const resp =  await dispatch(applyLeave(leaveParams)).unwrap();

    console.log(resp)
    if(resp.success){
      toast.success( resp.message, {duration:5000} )
      navigate("/home/leaves")
    }else{
      toast.error(resp.error || resp.message,{duration:5000})
    }


  }
  function compareDates(startDate, endDate, startDatetype, endDatetype) {
      // Create Date objects from the provided startDate and endDate
      if( !['full day','first half','second half'].includes(startDatetype.toLowerCase()) || !['full day','first half','second half'].includes(endDatetype.toLowerCase()) ) return "Not valid start and end type";
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Ensure both start and end are valid Date objects before proceeding
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          alert("Invalid date input");
          return false
      }

      if (start.getTime() === end.getTime()) {

          if (endDatetype === 'First Half' && startDatetype === 'Second Half') {
              alert("Invalid Date and type combination");
              return false;
          }

          if (startDatetype === 'First Half' && endDatetype === 'Second Half') {
              return true;
          }

          if (startDatetype === endDatetype) {
              // If the types match, return 0.5 for half-day types or 1 for full-day types
              return true;
          }
      }else if( start < end ){

          const invalidCombinations = [
              ["Full Day", "Second Half"],
              ["First Half", "Full Day"],
              ["First Half", "Second Half"],
              ["Second Half", "Second Half"],
              ["First Half", "First Half"]
          ];

          if (invalidCombinations.some(([startType, endType]) => startDatetype.toLowerCase() === startType.toLowerCase() && endDatetype.toLowerCase() === endType.toLowerCase())) {
            alert ("This combination can't be applied.");
            return false;
          }


          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          let dayCount = Math.abs( (start - end) / (1000 * 60 * 60 * 24) ) + 1;

          if(['second half',"first half"].includes(startDatetype.toLowerCase())) dayCount-=0.5;
          if(['second half',"first half"].includes(endDatetype.toLowerCase())) dayCount-=0.5;

          return true;
      }

      return false;

  }

  return (<>
    <div className="w-4/5 m-auto p-6 bg-white border rounded-2xl">
      <form onSubmit={(e)=> e.preventDefault()}>
        <h1 className='font-bold text-center text-3xl p-4'>Leave Request</h1>
        <div className='flex flex-col mt-5'>

          <div className='flex flex-row'>
            <div className='w-1/2 mx-10'>
              <label className='font-semibold'>Start Date<sup>*</sup></label>
              <div className='my-2'>
                  <input type="date" name="startDate" value={leaveForm.startDate} className='w-full p-3 border rounded-md bg-white focus:border-2 focus:border-black outline-none' onChange={handleChange} />
              </div>
            </div>

            <div className='w-1/2 mx-10'>
              <label className='font-semibold'>Start Date BreakDown<sup>*</sup></label>
              <div className='my-2'>
                  <select  name="startDatetype" value={leaveForm.startDatetype} className='w-full p-3 border rounded-md bg-white focus:border-2 focus:border-black' onChange={handleChange}>
                    <option value="">Select Day Type</option>
                    <option value="First Half">First Half</option>
                    <option value="Second Half">Second Half</option>
                    <option value="Full Day">Full Day</option>
                  </select>
              </div>
            </div>

          </div>

          <div className='flex flex-row'>
            <div className='w-full flex flex-col mx-10'>
              <label className='font-semibold'>End Date<sup>*</sup></label>
              <div className='my-2'>
                  <input type="date" name="endDate" value={leaveForm.endDate} className='w-full p-3 border rounded-md bg-white' onChange={handleChange} />
              </div>
            </div>

            <div className='w-full flex flex-col mx-10'>
              <label className='font-semibold'>End Date BreakDown<sup>*</sup></label>
              <div className='my-2'>
                  <select  name="endDatetype" value={leaveForm.endDatetype} className='w-full p-3 border rounded-md bg-white' onChange={handleChange}>
                    <option value="">Select Day Type</option>
                    <option value="First Half">First Half</option>
                    <option value="Second Half">Second Half</option>
                    <option value="Full Day">Full Day</option>
                  </select>
              </div>
            </div>
          </div>

          <div className='w-full flex flex-col mx-10'>
            <label className='font-semibold'>Leave Type<sup>*</sup></label>
            <div className='my-2'>
                <select name='leaveTypeId' value={leaveForm.leaveTypeId} className='w-[42%] p-3 border rounded-md bg-white' onChange={handleChange}>
                  <option value="">Select Leave</option>
                  {data.map(leavetype => {
                    return (
                      <option value={leavetype._id}>
                        {leavetype.leaveType.charAt(0).toUpperCase() + leavetype.leaveType.slice(1)}
                      </option>
                    )
                  })}
                </select>
            </div>
          </div>

          <div className='flex flex-col mx-10'>
            <label className='font-semibold'>Description<sup>*</sup></label>
            <div className='my-2'>
                <textarea  onChange={handleChange} name="reason" value={leaveForm.reason} id="message" rows="4" className="w-full block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave Reason..."></textarea>
            </div>
          </div>

          <div className='text-center'>
            <button className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2 mb-2" aria-label="Delete device" onClick={handleApplyLeave}>Apply Leave</button>
          </div>

        </div>
      </form>
    </div>
  </>)
}

export default LeaveRequest