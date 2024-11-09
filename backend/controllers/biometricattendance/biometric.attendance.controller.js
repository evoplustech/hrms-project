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
          // const {date}
          // attendance insertion in the db

          // return response.status(200).json(attendanceRecords);

        }        
        await zkInstance.disconnect();
        
        const documentPresent = await attendanceModel.countDocuments();

        if(documentPresent < 1)
          throw new Error('No Document Insertd');
        
        response.status(200).json({"message":`${documentPresent} document Inserted`});

      }catch(error){
        console.log(error.message);
        response.status(500).json({"error":"Internal Server Error"});
      }
}

const groupAttendance = async (attendanceList)=>{
  
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
      employeeId : 208,
      date,
      checkInTime : InTime,
      checkOutTime : OutTime,
      totalHours

    });

    await createAttendance.save();

  })
  console.log(finalAttendanceObject);
  //  return finalAttendanceObject;
}


const addBiometricDevice = async (req,res) =>{

  try {

    const { deviceName, ipAddress, port, connectionType, status, isActive, method, id } = req.body;

    // const adminId = {_id:"672b0a57de2599055050bbfd",type:"admin"};
    const adminId = {_id:"6729ff2f40e30ad8370fa0a6",type:"admin"};

    if(adminId.type !== 'admin'){
      return res.status(400).json({success:false,message:`Permission denied: You are not authorized to ${method} a biometric device.`})
    }

    if(method === 'add'){
      const deviceExist = await biometricModel.findOne({ipAddress,port,isActive:true,adminId:adminId._id})

      if(deviceExist){
        return res.status(200).json({success:false,error:"Device Already Exist"})
      }

      const newbiometricModel = new biometricModel({ deviceName, ipAddress, port, connectionType, status, isActive,adminId: adminId._id });
      await newbiometricModel.save();

      return res.status(200).json({success:true,message:"Device Added Successfully."})
    }else if(method === 'update' && id !== ''){

      const deviceExist = await biometricModel.findOne({_id:id,isActive:true})

      if(!deviceExist){
        return res.status(200).json({success:false,error:"Unable to find the Device."})
      }
      await biometricModel.findOneAndUpdate({_id:id}, { deviceName, ipAddress, port, connectionType, status, isActive });
      return res.status(200).json({success:true,message:"Device Updated Successfully."})

    }else if(method === 'delete' && id !== ''){
      const deviceExist = await biometricModel.findOne({_id:id,isActive:true})

      if(!deviceExist){
        return res.status(200).json({success:false,error:"Unable to find the Device."})
      }

      await biometricModel.findOneAndUpdate({_id:id}, { isActive:false });
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
    const adminId = {_id:"6729ff2f40e30ad8370fa0a6",type:"admin"};
    
    if(adminId.type !== 'admin'){
      return res.status(400).json({success:false,message:`Permission denied: You are not authorized to access biometric device details.`})
    }

    const biometricDeviceDetails = await biometricModel.find({isActive:true,adminId:adminId._id});

    if(!biometricDeviceDetails.length){
      return res.status(400).json({success:false,message:`No Device Details Avaliable.`})
    }
    return res.status(200).json({ success: true, data: biometricDeviceDetails });

  } catch (error) {
    console.log(`Error in getBiometricDevice controller :: ${error.message}`);
    res.status(400).json({success:false, error: "Internal Server Error"})
  }
}


export { fetchAttendance, addBiometricDevice, getBiometricDevice }