import ZKLib  from 'node-zklib';
import biometricModel from '../../models/biometric/biometric.model.js';
import attendanceModel from '../../models/attendance/attendance.model.js';
import employeeProfessionalModel from '../../models/employee/EmployeeProfessional.model.js';


const fetchAttendance = async (request,response)=>{
        
      try{
        const {role} = request;
        const {ip,port} = request.body;

        if(role !=='admin')
          return response.status(403).json({ "error": "Access denied. You do not have permission to perform this action.","status":false });

        if(!ip || !port)
          return response.status(400).json({"error":"Bad Request Try Again!",success: false});
        
        const attendanceData = await  attendanceModel.find();
      
      // condition to check device configured or not 
       if(attendanceData.length)
          return response.status(400).json({"error":"Device Already Connected",success: false});

      // static user 
      const employeeRecords = await employeeProfessionalModel.find().select('employeeId');
     
        // const userId = [208];
        const userId = employeeRecords;

        let zkInstance = new ZKLib(ip, port, 5200, 5000);
        await zkInstance.createSocket();

        // const attendanceLog = await zkInstance.getUsers();
        const attendanceLog =  await zkInstance.getAttendances();

      //  console.log(attendanceLog);

        for(const userids of userId) {

          const attendanceList = attendanceLog.data.filter((value)=>(
            userids.employeeId === value.deviceUserId
          ));
          const attendanceRecords = await groupAttendance(attendanceList, userids._id);
          // const {date}
          // attendance insertion in the db

          // return response.status(200).json(attendanceRecords);

        }        
        await zkInstance.disconnect();
        
        const documentPresent = await attendanceModel.countDocuments();

        if(documentPresent < 1)
          throw new Error('No Document Insertd');
        
        response.status(200).json({"message":`${documentPresent} document Inserted`,success: true});

      }catch(error){
        console.log(error.message);
        response.status(500).json({"error":"Internal Server Error",success: false});
      }
}








const groupAttendance = async (attendanceList,empid)=>{
  
      const attendanceListObj = {}; // formted attendance Object List

      attendanceList.forEach((object)=>{
        // console.log(object.recordTime);
        const getDate =  object.recordTime;
        const date= getDate.toISOString().split('T')[0];
        // const newDate=  date.split('T')[0];
        if(!attendanceListObj[date])
          attendanceListObj[date] = [];

        attendanceListObj[date].push(object);
      });

 // to get First and last punch object of the day of employee
    const finalAttendanceObject = Object.entries(attendanceListObj).map(async ([date,punch])=>{
    const sortedPunch =  punch.sort((a,b)=>{ return (new Date(a.recordTime)-new Date(b.recordTime))});
    
    
    let {recordTime : checkInTime }= sortedPunch[0] || {};
    let {recordTime : checkOutTime } = sortedPunch[sortedPunch.length-1] || {};

    // Converting to local time in ISO format

    let InTime = checkInTime.toLocaleTimeString('en-US', { hour12: false });
    let OutTime = checkOutTime.toLocaleTimeString('en-US', { hour12: false });

    const differenceInMilliseconds = checkOutTime - checkInTime;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const hours = Math.floor(differenceInSeconds / 3600);
    
    const minutes = Math.floor((differenceInSeconds % 3600) / 60);
    const totalHours = `${hours}:${minutes}`;

    const createAttendance = await   attendanceModel.create({
      employeeId : empid,
      date,
      checkInTime : InTime,
      checkOutTime : OutTime,
      totalHours

    });

    // await createAttendance.save();

  })
  console.log(finalAttendanceObject);
  //  return finalAttendanceObject;
}




export {fetchAttendance}