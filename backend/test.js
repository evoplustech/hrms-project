import ZKLib  from 'node-zklib';

async function  test(){
    try{
        let zkInstance = new ZKLib('10.101.0.7', 4370, 5200, 5000);
        await zkInstance.createSocket();
          // const attendanceLog = await zkInstance.getUsers();
          const attendanceLog =  await  zkInstance.getAttendances();
  
        //  console.log(attendanceLog);
  
          console.log(attendanceLog);
          zkInstance.disconnect();
     
    }catch(error){
        console.log(error);
    }
  }
  
  
  test();