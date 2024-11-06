import bcrypt from 'bcrypt'
import employeeProfessionalModel from '../../models/employee/EmployeeProfessional.model.js';

const createProfDetail = async (request,response)=>{
  try{
    
    const {empPersonalId,employeeId,department,designation,dateOfJoining,employmentType,reportingManager,email,password,confirmPassword,role,shift} = request.body;

    if(!empPersonalId || !employeeId || !department || !designation || !dateOfJoining || !employmentType  || !reportingManager  || !email || !password || !confirmPassword || !role || !shift ){
        return response.status(404).json({error:"Validation Failed Form Fields Missing"});
    } 

    // Check for duplicate EmpId
     const getEmployees = await employeeProfessionalModel.findOne({employeeId});
      if(getEmployees)
        return response.status(409).json({error : "Duplicate Id Found Employee Id Already Exists"});

    // Check for duplicate Username
    const getUsername = await employeeProfessionalModel.findOne({email});
    if(getUsername)
      return response.status(400).json({error:"Duplicate username or Email Id Found"});

    // validate if the user is admin or not
    // if(request.jwtToken !=='admin')
    //   return response.status(403).json({error:"Forbidden Cannot Perform This Action"});

    // Validate confirm Password
    if(confirmPassword!==password)
      return response.status(400).json({"error":"Pssword and confirm password mismatch"});

    // encrypting the password
      const saltValue = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password,saltValue);

    // Proper Date Time Format
     
      request.body.dateOfJoining = new Date(dateOfJoining);
      request.body.password = hashPassword;

      // const createProDetail = await employeeProfessionalModel.create(request.body);
      const createProDetail = new employeeProfessionalModel(request.body);
        await createProDetail.save();

    
    return response.status(201).json({ "message": "Professional details created successfully", data: createProDetail });
  }catch(error){
    console.log(error.message);
    response.status(500).json({"error":"Internal Server Error"});
  }

}


//Function To Update the record

async function updateProRecord(request,response){
  try{
    const {empPersonalId,employeeId,department,designation,dateOfJoining,employmentType,reportingManager,role,shift} = request.body;

    if(!empPersonalId || !employeeId || !department || !designation || !dateOfJoining || !employmentType  || !reportingManager  ||  !role || !shift ){
        return response.status(404).json({error:"Validation Failed Form Fields Missing"});
    } 

        const {empId} = request.params;
    // check if the resord is present

    if(!empId)
      return response.status(400).json({"error":"Record to modify has not been specified"});

      const empRecord = await employeeProfessionalModel.findById(empId);

      if(!empRecord)
        return response.status(400).json({"error":"No Specified Employee found"});

      request.body.dateOfJoining = new Date(dateOfJoining);

      await employeeProfessionalModel.updateOne({_id:empId}, {$set:request.body});

      response.status(200).json({"message":"Record Updated Successfully"});
  }catch(error){
    console.log(error.message);
    response.status(500).json({"error":"Internal Server Error"});
  }
}

// Function To delete record

async function deleteProRecord(request,response){
  try{

    const {empId} = request.params;

    if(!empId)
      return response.status(400).json({"error":"Employee To Delete Need To Be Specified"});

    const empData = await  employeeProfessionalModel.findById(empId);

    if(!empData)
      return response.status(404).json({"error":"User not found"});

      await employeeProfessionalModel.updateOne({_id:empId},{isActive:false});
    
     response.status(200).json({"message":"Employee Deleted Successfully"});

  }catch(error){
    console.log(error.message);
    response.status(500).send({"error":"Internal Server Error"});
  }
}

// Function To get The reporting manager list
async function getReportingManagerList(request,response){
try{

  const reportingList = await employeeProfessionalModel.find({role :{$ne:'employee'}}).populate('empPersonalId','firstName lastName').select('_id empPersonalId');

  if(reportingList.length === 0)
    return response.status(404).json({ "message": 'No Reporting Employees Found' });

  response.status(200).json(reportingList);

}catch(error){
  console.log(error.message);
  response.status(500).json({"error":"Internal server error"});
}

}

 

export {createProfDetail,updateProRecord,deleteProRecord,getReportingManagerList}