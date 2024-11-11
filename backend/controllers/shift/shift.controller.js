import shiftModel from "../../models/attendance/shift.model.js";

// Functionality To Create A New Shift
const createShift = async (request,response)=>{
  try{  

    const {role:empRole} = request;
    if(empRole !=='admin')
      return response.status(403).json({ "error": "Access denied. You do not have permission to perform this action.","success":false });

    const isValid = validateFormFields(request);

    if(!isValid)
      return response.status(422).json({"error":"Validation failed Form Fields Missing","success": false});

    const {shiftName,startTime,endTime,days} = request.body;
    
    const newShift=  new shiftModel({shiftName,startTime,endTime,days});
    await newShift.save();

     response.status(200).json({newShift,"success": true});

  }catch(error){
    console.log(error.message);
    response.status(500).json({"error":"Internal Server Error","success": false});
  }

}

//  Functionality To Update a  Shift
const updateShift = async (request,response)=>{
  try{
    const isValid = validateFormFields(request);
    const {role:empRole} = request;

    if(empRole !=='admin')
      return response.status(403).json({ "error": "Access denied. You do not have permission to perform this action.","success":false });

    if(!isValid)
      return response.status(422).json({"error":"Validation failed Form Fields Missing","success": false});

    const {shiftId} = request.params;
    const {shiftName,startTime,endTime,days} = request.body;

    const editShift = await shiftModel.findOneAndUpdate({_id:shiftId},{shiftName,startTime,endTime,days},{
      new:true
    });

    if(!editShift || !shiftId)
      return response.status(404).json({"error":"Updation Failed.!Shift Not Updated","success": false});


    response.status(200).json({"message":"Shift Updated","success": true});

  }catch(error){
    console.log(error.message);
    response.status(500).json({"error":"Internal Server Error","success": false});
  }
}

//  Functionality To Delete a  Shift
const deleteShift = async (request,response)=>{
    try{

      const {shiftId}  = request.params;
      const {role:empRole} = request;

      if(empRole !=='admin')
        return response.status(403).json({ "error": "Access denied. You do not have permission to perform this action.","success":false });

      if(!shiftId)
        return response.status(400).json({"error":"Shift To Delete Need To Be Specified"});

        await shiftModel.updateOne({_id:shiftId},{isActive:false});

        return response.status(200).json({"message":"Shift Deleted Successfully"});

    }catch(error){
      console.log(error.message);
      response.status(500).json({"error":"Internal Server Error"});
    }
}

// function to Get All Shifts 

const getAllShifts = async (request,response)=>{

  try{
    // validate The User
    const allShifts = await shiftModel.find();
    const {role:empRole} = request;

    if(empRole !=='admin')
      return response.status(403).json({ "error": "Access denied. You do not have permission to perform this action.","success":false });

      if(!allShifts)
        return response.status(400).json({"error":"no Shifts Found","success":false});

    
    response.status(200).json({allShifts,"success":true});

  }catch(error){
    console.log(error.message);
    response.status(500).json({"error":"Internal Server Error","success":false});
  } 

}

// Function To Validate Form Fields
const validateFormFields= (request)=>{
  const {shiftName,startTime,endTime,days} =  request.body;

  if(!shiftName || !startTime || !endTime || !days)
    return false;

  return true;

}


export {createShift,updateShift,deleteShift,getAllShifts}