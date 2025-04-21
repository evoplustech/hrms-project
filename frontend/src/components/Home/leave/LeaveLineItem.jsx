import { BorderLeft } from '@mui/icons-material';
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
            <td className="py-3 border-b text-sm capitalize text-center"><div className='cell-border'>{leave.name}</div></td>
            <td className="py-3 border-b text-sm capitalize text-center"><div className='cell-border'>{leave.leaveType}</div></td>
            <td className="py-3 border-b text-sm capitalize text-center"><div className='cell-border'>{leave.startDate} ({leave.startDatetype})</div></td>
            <td className="py-3 border-b text-sm capitalize break-words text-center"><div className='cell-border'>{leave.endDate} ({leave.endDatetype})</div></td>
            <td className="py-3 border-b text-sm capitalize text-center"><div className='cell-border'>{leave.numberofDays}</div></td>
            <td className="py-3 border-b text-sm capitalize text-center"><div className='cell-border'>{leave.leaveReason}</div></td>
            <td className="py-3 border-b text-sm capitalize text-center"><div className='cell-border'>{leave.leaveStatus}</div></td>
            <td className="py-3 border-b text-sm capitalize text-center"><div className='cell-border'>{leave.approvedBy}</div></td>
            <td className="py-3 border-b text-sm capitalize text-center"><div className='cell-border'>{leave.appliedOn}</div></td>
            <td className="py-3 border-b text-sm capitalize text-center">
                <div className='flex flex-row items-end justify-center' >
                    {approveBtnshow && <p title='Approved' onClick={()=>handleAction('Approved',leave)} >
                        <img src={`../approve.png`} width={20} className='cursor-pointer' />
                    </p>}
                    {cancelBtnshow && <p title='Cancelled' onClick={()=>handleAction('Cancelled',leave)} >
                        <img src={`../cancel.png`} width={20} className='cursor-pointer' />
                    </p>}
                    {rejectBtnshow && <p title='Reject'  onClick={()=>handleAction('Rejected',leave)} >
                        <img src={`../reject.png`} width={20} className='cursor-pointer' />
                    </p>}
                </div>
            </td>
        </tr>
    </>)
});

export default LeaveLineItem