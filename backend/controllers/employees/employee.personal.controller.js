import employeePersonalModel from "../../models/employee/employeePersonal.model.js";

// Function To Create New Employee In The Db
const createPersonalDetail = async (request,response)=>{

    try{
      // return response.status(422).json(resquest.body);
      const formField = validateFormFields(request);
      console.log(formField);
      const {firstName,lastName} = formField;

      if(!formField.isValid)
        return response.status(422).json({"error":"Validation failed Form Fields Missing"});

      delete formField.isValid;

      formField.profilepic = `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;

      // Creating the record in the db
      const createEmployee = new employeePersonalModel(formField);
      
      await createEmployee.save();

      response.status(201).json(createEmployee);

    }catch(error){
      console.log(error.message);
      response.status(500).json({"error":"Internal Server Error"});
    }

}

// Function To Update Employee Information

const updatePersonalDetail = async (request,response)=>{
  try{  
    const formField = validateFormFields(request);
    const {empID} = request.params;

    if(!formField.isValid)
      return response.status(422).json({"error":"Validation failed Form Fields Missing"});

    delete formField.isValid;

    // Updating the employee records in the Db
    
    const udatedRecord = await employeePersonalModel.findByIdAndUpdate(empID,formField,{new:true});
    
    if(!udatedRecord)
      return response.status(404).json({"error":"User Not Found,updation Failed"});

    response.status(200).json(udatedRecord);

  }catch(error){
    console.log(error.message);
    response.status(500).json({"error":"Internal Server Error"});
  }
}

// Function To Delete an Record

const deletePersonalDetail = async(request,response)=>{
  try{

    const {empID} = request.params;

    if(!empID)
      return response.status(400).json({"error":"Employee To Delete Need To Be Specified"});

    const empData = await  employeePersonalModel.findById(empID);

    if(!empData)
      return response.status(404).json({"error":"User not found"});

      await employeePersonalModel.updateOne({_id:empID},{isActive:false});

      return response.status(200).json({"message":"Employee Deleted Successfully"});

  }catch(error){
    console.log(error.message);
    response.status(500).send({"error":"Internal Server Error"});
  }


}

// Function To Get All Employee Personal Details

const getAllPersonalDetail = async (request,response)=>{
  try{

    const getAllData = await  employeePersonalModel.find();

    if(!getAllData)
      return response.status(200).json({"message":"No Employee Data Found"});

    response.status(200).json(getAllData);

  }catch(error){
    console.log(error.message);
    response.status(500).json({"error":"Internal Server Error"});
  }

}



//  function to validate the form fields
const validateFormFields = (request)=>{

  let formField = {}; 
  // ,idProofs
  console.log(request.body);
  const {firstName,lastName,dateOfBirth,gender,contactInfo,address,maritalStatus,emergencyContact,nationality} = request.body;
  
  const {phone,email} = contactInfo;
  const {name,relationship,phone:emgphone} = emergencyContact;

  formField = {
    firstName,
    lastName,
    dateOfBirth : new Date(dateOfBirth),
    gender,
    contactInfo,
    address,
    maritalStatus,
    emergencyContact,
    nationality
  }

  formField.isValid = true;

  if(!firstName || !lastName || !dateOfBirth || !gender  || !address || !maritalStatus  || !nationality || (!phone || !email) || (!name || !relationship || !emgphone))
    formField.isValid = false;

  return formField;

}
export {createPersonalDetail,updatePersonalDetail,deletePersonalDetail,getAllPersonalDetail}


