import holidayModel from "../../models/attendance/holiday.model.js";

const addHolidays = async  (request,response)=>{
  try{

    const {role:empRole} = request;
    const {holidayName,holidayDate,description,holidayType,isRecurring} = request.body;
    console.log(empRole,'<===>',request.body);
    if(!empRole || empRole.toLowerCase() !=='admin')
      return response.status(403).json({ error: "Access denied. You do not have permission to perform this action.",success:false });

    if(!holidayName || !holidayDate  || !holidayType || isRecurring === undefined)
      return response.status(422).json({error:"Validation failed Form Fields Missing",success: false});


    const AddHoliday = await  holidayModel.create({holidayName,holidayDate,description,holidayType,isRecurring});

    response.status(201).json({ message: "Holiday Created", data:AddHoliday,"success": true});
  }catch(error){
    console.log(error.message);
    response.status(500).json({error:'Internal Server Error',success:false});
  }
}

export {addHolidays};