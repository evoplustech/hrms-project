import ZKLib  from 'node-zklib';
import biometricModel from '../../models/biometric/biometric.model.js';
import attendanceModel from '../../models/attendance/attendance.model.js';
import employeeProfessionalModel from '../../models/employee/EmployeeProfessional.model.js';
import {parse,isWithinInterval,parseISO,subDays, addDays,isSameDay  } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';
import  moment from 'moment-timezone';
import leaveModel from '../../models/attendance/leave.model.js';
import { holidayModel } from '../../models/attendance/holiday.model.js';


const fetchAttendance = async (request,response)=>{
  try{
      const {role} = request;
      const {ip,port} = request.body;

      if(role.toLowerCase() !=='admin')
        return response.status(403).json({ "error": "Access denied. You do not have permission to perform this action.","status":false });

      if(!ip || !port)
        return response.status(400).json({"error":"Bad Request Try Again!",success: false});
      const documentPresent = await getAttendanceFromDevice({ip,port});
      response.status(200).json({"message":documentPresent,success: true});

  }catch(error){
      console.log(error.message);
      response.status(500).json({"error":"Internal Server Error",success: false});
  }
}

const getAttendanceFromDevice= async ({ip,port})=>{
try{


  // const attendanceData = await  attendanceModel.find();
  const attendanceData = await  attendanceModel.findOne().sort({ trackingTime: -1 });
  let recordTime;

  const userId = await employeeProfessionalModel.find({ employeeId: { $in: ['208','1069'] } }).populate('shift','cumulativeStartTime startTime days name');
  // const userId = [{employeeId : '1069',shift:'night'},{employeeId : '208',shift:'nightd'}];
  let zkInstance = new ZKLib(ip, port, 5200, 5000);
  await zkInstance.createSocket();
  // const attendanceLog = await zkInstance.getUsers();
  const attendanceLog =  await zkInstance.getAttendances();
  // console.log('this is attendanceLog==>',attendanceLog);
  // return attendanceLog;
  for(const employeeData of userId) {
    const attendanceLogs = attendanceLog.data.filter((value)=>{
       recordTime = attendanceData?.trackingTime ? moment.utc(attendanceData.trackingTime).tz('Asia/Kolkata').toDate() : new Date("2025-04-01");
      // console.log('recordTime jolllksldkflskdlfklskd',recordTime);
      return (
        employeeData.employeeId === value.deviceUserId
         &&
        moment(value.recordTime).tz('Asia/Kolkata').toDate() > recordTime
      );
  });
  if(attendanceLogs.length > 0){
    const attendanceRecords = await groupAttendance({attendanceLogs, employeeData,recordTime });
    // return attendanceRecords;
  }
  }        
  await zkInstance.disconnect();
  const documentPresent = await attendanceModel.countDocuments();
  // console.log('documentPresent',documentPresent);
  // return documentPresent;
  }catch(error){
    console.log(error.message);
  }
}

const groupAttendance = async ({attendanceLogs,employeeData,recordTime})=>{
  try{

const attendanceList = [...attendanceLogs]; // copy the logs for processing
// return attendanceList;
for(let dateNow = new Date(recordTime) ; dateNow <= new Date();dateNow = addDays(dateNow,1)){
    // console.log('dateNow]]>',dateNow);
    const format_today = dateNow.toISOString().split("T")[0];
    // console.log('this isn jjsformat_today->',format_today);
    let arr = [];
    attendanceLogs.find((value)=>{
      if(value.recordTime.toISOString().includes(format_today)){
        arr.push(1);
      } 
    });

    if(arr.length <= 0){     
      attendanceList.push({"userSn":'',"deviceUserId":employeeData.employeeId,"recordTime":dateNow,"ip":"10.101.0.7",data:true});
    }
}
  const employeeRecords = await employeeProfessionalModel.findOne({employeeId:employeeData.employeeId}).populate('shift','cumulativeStartTime startTime days').select('employeeId shift');
  const leaveRecords = await leaveModel.findOne({employeeId:employeeData._id}).populate('leaveTypeId','leaveType');
  const timeZone = 'Asia/Kolkata';
  const currentDate = toZonedTime(new Date(), timeZone);
  const currentDateTime = format(currentDate, 'yyyy-MM-dd hh:mm:ss a', { timeZone });
  const holiday = await holidayModel.find();
      const attendanceListObj = {}; // formted attendance Object List
      
      attendanceList.forEach((object)=>{
        const dateString = object.recordTime.toISOString();
        let newDate = format(dateString, 'yyyy-MM-dd hh:mm:ss a', { timeZone });
        let date= newDate.split(/[ ]/)[0];
        if(!attendanceListObj[date]){
          attendanceListObj[date] = [];
        }
        if(employeeData['shift'].name.toLowerCase()==='night shift'){
          if(newDate.includes('AM')){
            const dateConversion = new Date(date); // Original date
            const prevDate = subDays(dateConversion, 1).toISOString().split(/[T]/)[0];
            date = prevDate;

             if(!attendanceListObj[date]){
              attendanceListObj[date] = [];
            }
          }
        }
        if(!object.data)
          attendanceListObj[date].push(newDate);
      });
  console.log('this is attendanceListObj==>',attendanceListObj);
     
 // to get First and last punch object of the day of employee
    Object.entries(attendanceListObj).map(async ([date,punch])=>{
      let status;
      let InTime;
      let OutTime;
      let totalHours;
      let datenow = new Date("2025-01-02");
      let  checkInTime;
      let  checkOutTime;
      const selectRecord = await attendanceModel.findOne({ employeeId : employeeData.employeeId,date :new Date(`${date}T00:00:00Z`)});
    if(punch.length > 0){
          checkInTime  = punch[0];
          // console.log('checkInTime',checkInTime);
          if(selectRecord){
            checkInTime = `${date} ${selectRecord.checkInTime}`;
            // console.log('if conditiom inside',checkInTime);
          }
         
          checkOutTime = punch[punch.length-1];
        // Converting to local time in ISO format
         InTime = new Date(checkInTime).toLocaleTimeString('en-US', { hour12: true });
         OutTime = new Date(checkOutTime).toLocaleTimeString('en-US', { hour12: true });

        const differenceInMilliseconds = new Date(checkOutTime) - new Date(checkInTime);
        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        const hours = Math.floor(differenceInSeconds / 3600);
        
        const minutes = Math.floor((differenceInSeconds % 3600) / 60);
        totalHours = `${hours}:${minutes}`;
        const punchInTime = moment(InTime, 'hh:mm:ss A'); 
        const shiftTime =moment(employeeRecords['shift'].cumulativeStartTime, 'hh:mm:ss A');
        //  console.log('cumulative timeeeeeeff',employeeRecords['shift'].cumulativeStartTime);
        status = hours < 9 ? 'Early Left' : 'Present';
        if(punchInTime.isAfter(shiftTime)) 
          status = 'Late-In';
    }else{
    //  check weather the shift for the employeee is started before update of the attendance
      status = 'Absent';
      checkInTime ="";
      checkOutTime ="";
      // const todayDay = new Date().toLocaleDateString("en-US",{weekday:"long"}).toLowerCase(); 
      const todayDay = new Date(date).toLocaleDateString("en-US",{weekday:"long"}).toLowerCase(); 
      const workingDays= employeeRecords['shift'].days;
      const checkStartDate = leaveRecords?.startDate || '1970-01-01T00:00:00.000+00:00';
      const checkEndDate = leaveRecords?.endDate || '1970-01-01T00:00:00.000+00:00';
      // const holidayDate = holidayModel?.holidayDate || '1970-01-01T00:00:00.000+00:00';
      if(!workingDays.includes(todayDay)){  // for cron change to the current time 
        status = "Week Off";
      }

     const leaveStartDate =  moment.utc(checkStartDate).tz('Asia/Kolkata').format('YYYY-MM-DD');
     const leaveEndDate =  moment.utc(checkEndDate).tz('Asia/Kolkata').format('YYYY-MM-DD');
    //  const holiday = moment.utc(holidayDate).tz('Asia/Kolkata').format('YYYY-MM-DD');
      
      if(leaveStartDate <= currentDateTime && currentDateTime <= leaveEndDate){
        status=leaveRecords.startDatetype==='Full Day'?'Leave':'Half-Day';
        if(currentDateTime===leaveEndDate)
          status=leaveRecords.endDatetype==='Full Day'?'Leave':'Half-Day';
      }

     const holidayPresent =  holiday.filter((value)=>{
          return isSameDay(new Date(value.holidayDate),new Date(date))
      })
     
      if(holidayPresent.length > 0 )
        status = 'Holiday';
    }
      
      if(selectRecord){

          const IntimeData = selectRecord.checkInTime ? selectRecord.checkInTime : OutTime;

          await attendanceModel.updateOne({
            employeeId : employeeData.employeeId,
            date :new Date(`${date}T00:00:00Z`)
          },{
            // $setOnInsert: { checkInTime: InTime }, // Set only when inserting
            $set: {
            employeeId : employeeData.employeeId,
            date,
            checkInTime: IntimeData,
            checkOutTime : OutTime,
            totalHours,
            status,
            trackingTime: new Date()
            }
          });
      }else{
           // insert the Records in the db
          await attendanceModel.create({
            employeeId : employeeData.employeeId,
            date,
            checkInTime : InTime,
            checkOutTime : OutTime,
            totalHours,
            status,
            trackingTime: new Date()
          });
      }
  })
  return true;
}catch(error){
    console.log(error.message);
}
}


const groupAttendance_backup = async ({attendanceLogs,employeeData,recordTime})=>{

  // Checking For Every Day
  // return attendanceLogs;
  // const initialDate = new Date("2024-12-01");
  let attendanceList =attendanceLogs;
  // return attendanceList;
  for(let dateNow = new Date(recordTime) ; dateNow <= new Date();dateNow = addDays(dateNow,1)){
      // console.log('dateNow]]>',dateNow);
      const format_today = dateNow.toISOString().split("T")[0];
      // console.log('this isn jjsformat_today->',format_today);
      let arr = [];
      attendanceLogs.find((value)=>{
        if(value.recordTime.toISOString().includes(format_today)){
          arr.push(1);
        } 
      });
  
      if(arr.length <= 0){     
        attendanceList.push({"userSn":'',"deviceUserId":employeeData.employeeId,"recordTime":dateNow,"ip":"10.101.0.7",data:true});
      }
  }
  // return attendanceList;
  // let attendanceList =attendanceLogs;
  
    const employeeRecords = await employeeProfessionalModel.findOne({employeeId:employeeData.employeeId}).populate('shift','cumulativeStartTime startTime days').select('employeeId shift');
    const leaveRecords = await leaveModel.findOne({employeeId:employeeData._id}).populate('leaveTypeId','leaveType');
    const timeZone = 'Asia/Kolkata';
    const currentDate = toZonedTime(new Date(), timeZone);
    const currentDateTime = format(currentDate, 'yyyy-MM-dd hh:mm:ss a', { timeZone });
    const holiday = await holidayModel.find();
        const attendanceListObj = {}; // formted attendance Object List
        
        attendanceList.forEach((object)=>{
          const dateString = object.recordTime.toISOString();
          let newDate = format(dateString, 'yyyy-MM-dd hh:mm:ss a', { timeZone });
          let date= newDate.split(/[ ]/)[0];
          if(!attendanceListObj[date]){
            attendanceListObj[date] = [];
          }
          if(employeeData.shift==='night'){
            if(newDate.includes('AM')){
              const dateConversion = new Date(date); // Original date
              const prevDate = subDays(dateConversion, 1).toISOString().split(/[T]/)[0];
              date = prevDate;
  
               if(!attendanceListObj[date]){
                attendanceListObj[date] = [];
              }
            }
          }
          if(!object.data)
            attendanceListObj[date].push(newDate);
        });
        
        // return attendanceListObj;
          const dataaa = [];
          let  updateResult ;
   // to get First and last punch object of the day of employee
      const finalAttendanceObject = Object.entries(attendanceListObj).map(async ([date,punch])=>{
  
        let status;
        let InTime;
        let OutTime;
        let totalHours;
        let datenow = new Date("2025-01-02");
        let  checkInTime;
        let  checkOutTime;
        const selectRecord = await attendanceModel.findOne({ employeeId : employeeData.employeeId,date :new Date(`${date}T00:00:00Z`)});
      if(punch.length > 0){
            checkInTime  = punch[0];
            console.log('checkInTime',checkInTime);
            if(selectRecord){
              checkInTime = `${date} ${selectRecord.checkInTime}`;
              console.log('if conditiom inside',checkInTime);
            }
           
            checkOutTime = punch[punch.length-1];
          // Converting to local time in ISO format
           InTime = new Date(checkInTime).toLocaleTimeString('en-US', { hour12: true });
           OutTime = new Date(checkOutTime).toLocaleTimeString('en-US', { hour12: true });
  
          const differenceInMilliseconds = new Date(checkOutTime) - new Date(checkInTime);
          const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
          const hours = Math.floor(differenceInSeconds / 3600);
          
          const minutes = Math.floor((differenceInSeconds % 3600) / 60);
          totalHours = `${hours}:${minutes}`;
          const punchInTime = moment(InTime, 'hh:mm:ss A'); 
          const shiftTime =moment(employeeRecords['shift'].cumulativeStartTime, 'hh:mm:ss A');
          //  console.log('cumulative timeeeeeeff',employeeRecords['shift'].cumulativeStartTime);
          status = hours < 9 ? 'Early Left' : 'Present';
          if(punchInTime.isAfter(shiftTime)) 
            status = 'Late-In';
  
          // update the data in the db here
      
      }else{
      //  check weather the shift for the employeee is started before update of the attendance
        status = 'Absent';
        checkInTime ="";
        checkOutTime ="";
        // const todayDay = new Date().toLocaleDateString("en-US",{weekday:"long"}).toLowerCase(); 
        const todayDay = new Date(date).toLocaleDateString("en-US",{weekday:"long"}).toLowerCase(); 
        const workingDays= employeeRecords['shift'].days;
        const checkStartDate = leaveRecords?.startDate || '1970-01-01T00:00:00.000+00:00';
        const checkEndDate = leaveRecords?.endDate || '1970-01-01T00:00:00.000+00:00';
        // const holidayDate = holidayModel?.holidayDate || '1970-01-01T00:00:00.000+00:00';
        if(!workingDays.includes(todayDay)){  // for cron change to the current time 
          status = "Week Off";
          // console.log(workingDays);
          // console.log(date,'todayDay',todayDay);
        }
  
       const leaveStartDate =  moment.utc(checkStartDate).tz('Asia/Kolkata').format('YYYY-MM-DD');
       const leaveEndDate =  moment.utc(checkEndDate).tz('Asia/Kolkata').format('YYYY-MM-DD');
      //  const holiday = moment.utc(holidayDate).tz('Asia/Kolkata').format('YYYY-MM-DD');
        
        if(leaveStartDate <= currentDateTime && currentDateTime <= leaveEndDate){
          status=leaveRecords.startDatetype==='Full Day'?'Leave':'Half-Day';
          if(currentDateTime===leaveEndDate)
            status=leaveRecords.endDatetype==='Full Day'?'Leave':'Half-Day';
        }
  
       const holidayPresent =  holiday.filter((value)=>{
            return isSameDay(new Date(value.holidayDate),new Date(date))
        })
       
        if(holidayPresent.length > 0 )
          status = 'Holiday';
      }
        
        if(selectRecord){
          
            await attendanceModel.updateOne({
              employeeId : employeeData.employeeId,
              date :new Date(`${date}T00:00:00Z`)
            },{
              // $setOnInsert: { checkInTime: InTime }, // Set only when inserting
              $set: {
              employeeId : employeeData.employeeId,
              date,
              checkInTime: selectRecord.checkInTime,
              checkOutTime : OutTime,
              totalHours,
              status,
              trackingTime: new Date()
              }
            });
        }else{
             // insert the Records in the db
            await attendanceModel.create({
              employeeId : employeeData.employeeId,
              date,
              checkInTime : InTime,
              checkOutTime : OutTime,
              totalHours,
              status,
              trackingTime: new Date()
            });
        }
      // console.log('hello worldsshshdghgdsgdjgs ',updateResult);
  
     
      
      // const sortedPunch =  punch.sort((a,b)=>{ return (new Date(a.recordTime)-new Date(b.recordTime))});
      // dataaa.push({
      //   employeeId : employeeData.employeeId,
      //   date,
      //   checkInTime : InTime,
      //   checkOutTime : OutTime,
      //   totalHours,
      //   status,
      //   trackingTime: new Date()
      // });
    })
    return true;
  }


const addBiometricDevice = async (req,res) =>{

  try {

    const { deviceName, ipAddress, port, connectionType='Ether', status, isActive, method, _id } = req.body;

    // const adminId = {_id:"672b0a57de2599055050bbfd",type:"admin"};
    const adminId = {_id:req.empId,type:req.role};

    if((adminId.type).toLowerCase() !== 'admin'){
      return res.status(400).json({success:false,message:`Permission denied: You are not authorized to ${method} a biometric device.`})
    }

    if(method === 'add'){
      const deviceExist = await biometricModel.findOne({ipAddress,port,isActive:true,adminId:adminId._id})

      if(deviceExist){
        return res.status(200).json({success:false,error:"Device Already Exist"})
      }

      const newbiometricModel = new biometricModel({ deviceName, ipAddress, port, connectionType, status, isActive,adminId: adminId._id });
      await newbiometricModel.save();

      return res.status(200).json({success:true,message:"Device Added Successfully.",data:newbiometricModel})
    }else if(method === 'update' && _id !== ''){

      const deviceExist = await biometricModel.findOne({_id,isActive:true})
      console.log("device",deviceExist,_id)
      if(!deviceExist){
        return res.status(200).json({success:false,error:"Unable to find the Device."})
      }
      const response = await biometricModel.findOneAndUpdate({_id}, { deviceName, ipAddress, port, connectionType, status, isActive },{new:true});
      return res.status(200).json({success:true,message:"Device Updated Successfully.",data:response})

    }else if(method === 'delete' && _id !== ''){
      const deviceExist = await biometricModel.findOne({_id,isActive:true})

      if(!deviceExist){
        return res.status(200).json({success:false,error:"Unable to find the Device."})
      }

      await biometricModel.findOneAndUpdate({_id}, { isActive:false });
      return res.status(200).json({ success:true, message:"Device Deleted Successfully." })
    }
  } catch (error) {
    console.log("Error in addBiometricDevice controller :: ",error.message);
    res.status(400).json({success:false, error:"Internal server Error"})
  }
}


const getBiometricDevice = async (req,res) =>{ 
  try {
    
    // const adminId = {_id:"672b0a57de2599055050bbfd",type:"admin"};
    // const adminId = {_id:"6729ff2f40e30ad8370fa0a6",type:"admin"};
    const adminId = {_id:req.empId,type:req.role};

    if((adminId.type).toLowerCase() !== 'admin'){
      return res.status(400).json({success:false,message:`Permission denied: You are not authorized to access biometric device details.`})
    }

    const biometricDeviceDetails = await biometricModel.find({ isActive:true, adminId:adminId._id });

    if(!biometricDeviceDetails.length){
      return res.status(200).json({success:true,data:{}})
    }
    return res.status(200).json({ success: true, data: biometricDeviceDetails });

  } catch (error) {
    console.log(`Error in getBiometricDevice controller :: ${error.message}`);
    res.status(400).json({success:false, error: "Internal Server Error"})
  }
}


export { fetchAttendance, addBiometricDevice, getBiometricDevice,getAttendanceFromDevice }