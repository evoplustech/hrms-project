import React, { useEffect, useRef, useState } from 'react'
import { Modal, Box } from '@mui/material';
import toast from 'react-hot-toast';
import Input from '../../form/Input';
import { parseISO, parse, set ,differenceInMinutes, differenceInHours,format} from 'date-fns';
import DateCalander from '../../form/DateCalander';
import { RiSendPlaneFill } from "react-icons/ri";
import Select from '../../form/Select';
import useSelectorHook from '../../../../utils/useSelectorHook';
import { addAttendanceRequest } from '../../../slices/attendanceRequestSlice';
import { useDispatch } from 'react-redux';
import { updateAttendance } from '../../../slices/attendanceSlice';

// import Date from '../../form/Date';

const AttendanceRequestPopUp = ({record,popup,popupHandler}) => {
  const {_id,employeeId} = record;
  // console.log('record',record,new Date(record.checkInTime));
  const [intime,setIntime] = useState(new Date());
  const [outtime,setoutTime] = useState(new Date());
  const [loginHours,setLoginhrs] = useState(''); 
  const reason = useRef();const remark = useRef();
 const {data} = useSelectorHook('reason');
 const [fieldError,setfieldError] = useState('');
 const dispatch = useDispatch();
  // console.log('reasons it herere',reasons);
  useEffect(()=>{
    const intime = dateConversion({date:record.date,time:record.checkInTime});
    const out_time = dateConversion({date:record.date,time:record.checkOutTime});
    setIntime(intime);setoutTime(out_time);setLoginhrs(record.totalHours);setfieldError('');
  },[record.date]);
  
  // calcution of the login hours
const dateHandler = ({dateparam,time})=>{
  const dateTime1 = format(dateparam, 'yyyy-MM-dd HH:mm:ss');
  let dateTime = intime;
  let minutesDifference = differenceInMinutes(dateTime1, dateTime);
  if(time==='InTime'){
     dateTime = outtime;
     minutesDifference = differenceInMinutes(dateTime, dateTime1);
     setIntime(dateparam);
  }else{
      setoutTime(dateparam);
  } 
  const hours = Math.floor(minutesDifference / 60);  // Get total hours
  const minutes = minutesDifference % 60;
  // const formattedTime = format(new Date(0, 0, 0, hours, minutes), 'HH:mm');
  // setLoginhrs(`${formattedTime}`);
  setLoginhrs(`${hours}:${minutes}`);
}

const selectHandler=(e)=>{
  const selectValue = e.target.value;
  console.log(selectValue);
  if(selectValue)
    setfieldError('');
  else
    setfieldError('Please Select the Reason')
}
// request submit Handler 

const submitHandler = async ()=>{
  try{
    const reasonData = reason.current.value;
    const remarkData = remark.current.value; 
    console.log('reasonData',reasonData,'remarkData',remarkData,fieldError);
    if(reasonData===''){
      setfieldError('Please Select the Reason');
      console.log('entereteterterterteretrt');
      popupHandler(true);
      throw new Error('Please Select the Reason');
      // popupHandler(false);
      // return false;
    }
    if(new Date(outtime) <= new Date(intime)){
      toast.error('out-Time should not be less or equal to in-Time');
      return false;
    }
    // Generating the request Data set
      console.log('hi therer ',record.date);
      const date =record.date; 
      const inTime = format(intime, 'hh:mm:ss a');
      const outTime = format(outtime, 'hh:mm:ss a');
      const requestData = {attendanceId:_id,employeeId,date,inTime,outTime,reason:reasonData,remarks:remarkData};
  
      const {payload} = await dispatch(addAttendanceRequest(requestData));
      if(payload.success){
        dispatch(updateAttendance(payload?.data));
        toast.success(`Attendance Request Raised Successfully`);
        popupHandler(false);
      }else{
        toast.error(`${payload.error}`);
      }
        
  }catch(error){
    toast.error(`${error.message}`);
  }finally{
      // popupHandler(false);
  }
      
}

  
  return (
    <>
      <Modal open={popup} onClose={()=>popupHandler(false)} className="modelBox">
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
            width: '65%', // Set desired width
            height: 'auto', // Set desired height,
          }}
        >
          <center>
            <div>
              <p className="text-xl text-center text-slate-700 font-bold mb-6">Raise Attendance Request</p>
              <div className="flex flex-col items-start">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" width={"100%"}>
                  <tr className="bg-white" >
                    <th width={"25%"}>Date</th>
                    <th width={"25%"}>Status</th>
                    <th width={"25%"}>In-Time</th>
                    <th width={"25%"}>Out-Time</th>
                  </tr>
                  <tr className="font-semibold text-rose-700 text-lg">
                    <td>{record.date.split('T')[0] || ''}</td>
                    <td>{record.status}</td>
                    <td>{record.checkInTime || '00.00.00'}</td>
                    <td>{record.checkOutTime || '00.00.00'}</td>
                  </tr>
                </table>
                {/* <div> */}
                  <div className="font-semibold mt-6 space-x-4 flex flex-row w-full">
                    <div className="w-1/4 ">
                      <DateCalander className="smoke mt-3 border-2 border-sky-600  border-x-white border-t-white hover:none w-36" selected={intime} onChange={(date)=>dateHandler({dateparam:date,time:'InTime'})} name="inTime" showTimeSelect label={"In-Time"} timeIntervals={1} timeCaption={"Time"} placeholderText={"Select a date and time"}/>
                    </div>
                    <div className="w-1/4 ">
                      <DateCalander className="smoke mt-3 border-2 border-sky-600  border-x-white border-t-white hover:none w-36" name="outTime" selected={outtime} onChange={(date)=>dateHandler({dateparam:date,time:'outTime'})} showTimeSelect label={"Out-Time"} timeIntervals={1} timeCaption={"Time"} placeholderText={"Select a date and time"}/>
                    </div>
                    <div className="w-1/4 relative">
                    {/* <Select  ref={reason} label='Reasons *' options={data} name='reasons' onChange={selectHandler}/> */}
                    {/* <label for="countries_disabled" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label> */}
                    <select name='reasons' ref={reason} onChange={selectHandler} id="countries_disabled" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      <option value=''>Select a Reason</option>
                      {data.length > 0 && data.map((value)=>{
                        return <option key={value._id} value={value._id}>{value.name}</option>
                      })
                      }
                    </select>
                    {fieldError && <span className="text-red-500">{fieldError}</span>}
                    </div>
                    <div className="w-1/4 relative">
                    <Input ref= {remark} remarks="left-14" type="text" label='Remarks *' name='remark' placeholderText=""/>
                    </div>
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <div className="mt-6">
                      <label className="font-bold ">Login Hours : </label><span className=" border-2 w-16 px-2 py-1 font-semibold">{loginHours}</span>
                    </div> 
                    <div className="mt-6">
                    <button type="button" onClick = {submitHandler} className="flex rounded-lg font-semibold text-md justify-center items-center hover:bg-green-600 px-6 py-1.5 bg-emerald-500 text-white" >Raise Request <span ><RiSendPlaneFill className="w-6 h-6 ps-2 pt-1 text-white" /></span></button>
                    </div> 
                  </div>
                {/* </div> */}
              </div>
            </div>
          </center>
        </Box>
      </Modal>
    </>
  )
}

const dateConversion = ({date,time})=>{
  if(time===undefined || !time)
    time= "12:00:00 AM";
  
  const parsedDate = parseISO(date);
  const parsedTime = parse(time, 'h:mm:ss a', new Date());
  const combinedDateTime = set(parsedDate, {
    hours: parsedTime.getHours(),
    minutes: parsedTime.getMinutes(),
    seconds: parsedTime.getSeconds(),
  });
  return combinedDateTime;
}

export default AttendanceRequestPopUp