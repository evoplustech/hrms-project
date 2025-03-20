import React from 'react'
import { Modal, Box } from '@mui/material';
import { IoCloseSharp } from "react-icons/io5";
import useSelectorHook from '../../../../utils/useSelectorHook';
import { useDispatch } from 'react-redux';
import { approveAttendanceRequest } from '../../../slices/attendanceRequestSlice';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { updateAttendance } from '../../../slices/attendanceSlice';

const AttendanceRequestActions = ({popup,setpopup,record}) => {

  const {data} = useSelectorHook("authenticate");
  const { role: { name } = {} } = data || {}; 
  const roles = new Set(['manager','admin','hr']);
  const dispatch = useDispatch(); 
  const submitHandler= async (e)=>{
    try{
    const path = `/api/attendance/updateRequest/${record._id}`;
    const requestData = {approvedBy:data._id,status:e.target.value};
    const result = await dispatch(approveAttendanceRequest({path,data:requestData}));
    // Handle potential undefined payload (if request failed)
    if (!result.payload) {
      throw new Error("No response from server");
    }
    const {payload:{success}} =  result;
      if(success){
        const status = result.payload.data?.status || "approved";
        // console.log('akkkkkkkkkkkkkkkkkkkkksdasdhasdjakshdjk',result?.payload?.data);
        dispatch(updateAttendance(result?.payload?.data));
        toast.success(<span className="text-lime-400">{`Request ${status}`}</span>);
      }else{
        toast.error(<span className="text-rose-400">Unable To Update Request</span>);
      }
    }catch(error){
      toast.error(error.message || 'Something Went Wrong');
    }finally{
      setpopup(false);
    }
  } 
  return (
    <>
    <Modal open={popup} onClose={()=>setpopup(false)} className="modelBox">
      <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: '66%', // Set desired width
            height: 'auto', // Set desired height,
            overflow:scrollbars
          }}
        >
      
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-end "><button onClick={() => setpopup(!popup)}><IoCloseSharp className="w-6 h-6 p-1 mb-1 bg-slate-300 rounded-full  translate-x-6 -translate-y-4" /></button></div>
          <div className="w-full rounded-t-lg bg-gray-200 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">Attendance Request History Details</h1>
          </div>
        </div>

        {/* Body - Form Fields */}
        {/*  */}
        <div className="space-y-4 text-center">
          <h1 className="text-xl font-semibold text-neutral-600 underline">Employee Detail :</h1>
          <div class="grid md:grid-cols-4 md:gap-2 mt-4 ">
            <div class="relative z-0 w-full mb-5 group">
              <div class="flex flex-col pb-3">
                  <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-900 font-semibold">Employee ID:</dt>
                  <dd class="text-lg">{record.employeeId}</dd>
              </div>
            </div>
            <div class="relative z-0 w-full mb-5 group">
              <div class="flex flex-col pb-3">
                <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-900 font-semibold">Name:</dt>
                <dd class="text-lg">{`${record['empPersonalId']?.firstName} ${record['empPersonalId']?.lastName}` || ''}</dd>
              </div>
            </div>
            <div class="relative z-0 w-full mb-5 group">
              <div class="flex flex-col pb-3">
                <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-900 font-semibold">Department</dt>
                <dd class="text-lg">{`${record['department']?.name || ''}`}</dd>
              </div>
            </div>
            <div class="relative z-0 w-full mb-5 group">
                <div class="flex flex-col pb-3">
                    <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-900 font-semibold">Designation</dt>
                    <dd class="text-lg">{`${record['designation']?.name || ''}`}</dd>
                </div>
            </div>
          </div>
        </div>
          
        <div className="text-center">
          <h1 className="text-xl font-semibold text-neutral-600 underline">Request Details :</h1>
            <div class="grid md:grid-cols-5 md:gap-6 mt-4">
              <div class="relative z-0 w-full mb-5 group">
                  <div class="flex flex-col pb-3">
                      <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-900 font-semibold">
                      Shift Date</dt>
                      <dd class="text-lg"> {record.date ? format(new Date(record.date), 'dd-MM-yyyy') : "20-12-1997"}</dd>
                  </div>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <div class="flex flex-col pb-3">
                  <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-900 font-semibold">Check-In</dt>
                  <dd class="text-lg">{record['attendanceId']?.checkInTime || '00:00:00'}</dd>
                </div>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <div class="flex flex-col pb-3">
                  <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-900 font-semibold">Check-Out
                  </dt>
                  <dd class="text-lg">{record['attendanceId']?.checkOutTime || '00:00:00'}</dd>
                </div>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <div class="flex flex-col pb-3">
                  <dt class="mb-1 text-gray-500 md:text-lg  dark:text-gray-900 font-semibold">Requested Check-in
                  </dt>
                  <dd class="text-lg rounded-sm">{record?.inTime || '00:00:00'}</dd>
                </div>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <div class="flex flex-col pb-3">
                  <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-900 font-semibold">Requested Check-Out
                  </dt>
                  <dd class="text-lg">{record?.outTime || '00:00:00'}</dd>
                </div>
              </div>
            </div>
            <div class="grid md:grid-cols-3 md:gap-6 mt-4">
              <div class="relative z-0 w-full mb-5 group">
                <div class="flex flex-col pb-3">
                    <dt class="mb-1 text-gray-500 md:text-lg  dark:text-gray-900 font-semibold">Status
                    </dt>
                    <dd class="text-lg rounded-sm text-rose-500">{record.status || ''}</dd>
                </div>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <div class="flex flex-col pb-3">
                  <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-900 font-semibold">Reason
                  </dt>
                  <dd class="text-lg">{record['reason']?.name || ''}</dd>
                </div>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <div class="flex flex-col pb-3 bg-white px-6 rounded-lg shadow-md max-w-sm mx-auto">
                    <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-900 font-semibold">Remarks
                    </dt>
                    <dd class="text-lg">{record.remarks || ' '}</dd>
                </div>
              </div>
            </div>
        </div>
       
        {/* Footer */}
        { roles.has(name.toLowerCase()) && <div className="mt-6 flex justify-center space-x-3 w-full rounded-b-lg bg-slate-100  shadow-lg p-4">
          <button value="Approved" onClick={submitHandler} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >Approve Request</button>
          <button value="Rejected" onClick={submitHandler} className="rounded-lg bg-rose-400 px-4 py-2 text-white hover:bg-rose-500"
          >Reject Request</button>
        </div>
        }
        
      </Box>
    </Modal>
    </>
  )
}

export default AttendanceRequestActions