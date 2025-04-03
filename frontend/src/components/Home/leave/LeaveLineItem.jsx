import React from 'react'
import { FcApproval } from "react-icons/fc";

export const LeaveLineItem = React.memo(({ leave, handleAction, userDetail }) => {
    // console.log('test')
    let approveBtnshow = false;
    let cancelBtnshow = false;
    let rejectBtnshow = false;

    if(leave.employeeId !== userDetail._id && (leave.leaveStatus !== 'Approved'  && leave.leaveStatus === 'Pending')  && (['manager','admin','tl','hr'].includes( userDetail.role.name.toLowerCase() ) ) ){
        approveBtnshow = true
    }

    if(leave.employeeId === userDetail._id && leave.leaveStatus === 'Pending'){
        cancelBtnshow = true;
    }

    if( leave.employeeId !== userDetail._id && (leave.leaveStatus !== 'Rejected' && leave.leaveStatus !== 'Cancelled' && leave.leaveStatus === 'Pending') && ( ['manager','admin','tl','hr'].includes( userDetail.role.name.toLowerCase()) ) ){
        rejectBtnshow = true;
    }

    return (<>
        <tr className="odd:bg-gray-100 even:bg-white" id={`${leave.leaveId}`} >
            <td className="py-3 px-6 border-b ">{leave.name}</td>
            <td className="py-3 px-6 border-b">{leave.leaveType}</td>
            <td className="py-3 px-6 border-b">{leave.startDate} ({leave.startDatetype})</td>
            <td className="py-3 px-6 border-b break-words">{leave.endDate} ({leave.endDatetype})</td>
            <td className="py-3 px-6 border-b">{leave.numberofDays}</td>
            <td className="py-3 px-6 border-b">{leave.leaveReason}</td>
            <td className="py-3 px-6 border-b">{leave.leaveStatus}</td>
            <td className="py-3 px-6 border-b">{leave.approvedBy}</td>
            <td className="py-3 px-6 border-b">{leave.appliedOn}</td>
            <td className="py-3 px-6 border-b">
                <div className='flex flex-row items-end justify-center' >
                    {approveBtnshow && <p title='Approved' onClick={()=>handleAction('Approved',leave)} >
                        <img src={`/assets/approve.png`} width={40} className='cursor-pointer' />
                    </p>}
                    {cancelBtnshow && <p title='Cancelled' onClick={()=>handleAction('Cancelled',leave)} >
                        <img src={`/assets/cancel.png`} width={40} className='cursor-pointer' />
                    </p>}
                    {rejectBtnshow && <p title='Reject'  onClick={()=>handleAction('Rejected',leave)} >
                        <img src={`/assets/reject.png`} width={40} className='cursor-pointer' />
                    </p>}
                </div>
            </td>
        </tr>
    </>)
});

export default LeaveLineItem