import ZKLib  from 'node-zklib';
import biometricModel from '../../models/biometric/biometric.model.js';
import attendanceModel from '../../models/attendance/attendance.model.js';


const fetchAttendance = async (request,response)=>{
        
      try{
        const {ip,port} = request.body;
        if(!ip || !port)
          return response.status(400).send("Bad Request Try Again!");
        
        const attendanceData = await  biometricModel.find();
      
      // condition to check device configured or not 
       if(attendanceData.length)
          return response.status(200).json(attendanceData);

      // static user 
      const userId = [208];

        let zkInstance = new ZKLib(ip, port, 5200, 5000);
        await zkInstance.createSocket();

        // const attendanceLog = await zkInstance.getUsers();
        const attendanceLog =  await zkInstance.getAttendances();

      //  console.log(attendanceLog);

        for(const userids of userId) {

          const attendanceList = attendanceLog.data.filter((value)=>(
            userids === +value.deviceUserId
          ));

          
          const attendanceRecords = await groupAttendance(attendanceList);


        }
        // userId.forEach(userids => {
        //        const attendanceList = attendanceLog.data.filter((value)=>(
        //             userids === +value.deviceUserId
        //        ));

        //        // insert record in your database

        //         const attendanceRecords = groupAttendance(attendanceList);

        //         // db insertion of records in collections

        //       // return response.status(200).json(groupAttendance(attendanceList));

        //     });

        await zkInstance.disconnect();
        
        return response.status(200).json(groupAttendance(data));

      }catch(error){
        console.log(error.message);
        response.status(500).json({"error":"Internal Server Error"});
      }
}








const groupAttendance = (attendanceList)=>{
  
  const attendanceListObj = {}; // formted attendance Object List

  attendanceList.forEach((object)=>{
    console.log(object.recordTime);
    const getDate =  object.recordTime;
    const date= getDate.toISOString().split('T')[0];
    // const newDate=  date.split('T')[0];
    if(!attendanceListObj[date])
      attendanceListObj[date] = [];

    attendanceListObj[date].push(object);
 });

 // to get First and last punch object of the day of employee
  const finalAttendanceObject = Object.entries(attendanceListObj).map(([date,punch])=>{
    const sortedPunch =  punch.sort((a,b)=>{ return (new Date(a.recordTime)-new Date(b.recordTime))});

    return {
      date,
      firstPunch:sortedPunch[0],
      lastPunch:sortedPunch[sortedPunch.length-1]
    }

  })

 return finalAttendanceObject;
}




export {fetchAttendance}