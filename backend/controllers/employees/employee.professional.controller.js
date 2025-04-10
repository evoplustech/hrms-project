import bcrypt from 'bcrypt'
import employeeProfessionalModel from '../../models/employee/EmployeeProfessional.model.js';
import employeePersonalModel from '../../models/employee/employeePersonal.model.js';

const createProfDetail = async (request,response)=>{
  try{
    
    const {empPersonalId,employeeId,department,designation,dateOfJoining,employmentType,managerId,email,password,confirmPassword,role,shift,office,city,basic,hra,allowances,total} = request.body;

    

    const {role:empRole} = request;
    // console.log(empRole);
      if(empRole.toLowerCase() !=='admin')
         return response.status(403).json({ error: "Access denied. You do not have permission to perform this action.",success:false });

    if(!empPersonalId || !employeeId || !department || !designation || !dateOfJoining || !employmentType  || !managerId  || !email || !password || !confirmPassword || !role || !shift ){
        return response.status(404).json({error:"Validation Failed Form Fields Missing",success: false});
    } 

    // Check for duplicate EmpId
     const getEmployees = await employeeProfessionalModel.findOne({employeeId});
      if(getEmployees)
        return response.status(409).json({error : "Duplicate Id Found Employee Id Already Exists",success: false});

    // Check for duplicate Username
    const getUsername = await employeeProfessionalModel.findOne({email});
    if(getUsername)
      return response.status(400).json({error:"Duplicate username or Email Id Found",success: false});

    // validate if the user is admin or not
    // if(request.jwtToken !=='admin')
    //   return response.status(403).json({error:"Forbidden Cannot Perform This Action"});

    // Validate confirm Password
    if(confirmPassword!==password)
      return response.status(400).json({error:"Password and confirm password mismatch",success: false});

    // encrypting the password
      const saltValue = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password,saltValue);

    // Proper Date Time Format
     
      request.body.dateOfJoining = new Date(dateOfJoining);
      request.body.password = hashPassword;
      request.body.workLocation = {office,city};
      request.body.salary = {basic,hra,allowances,total};

      // const createProDetail = await employeeProfessionalModel.create(request.body);
      const createProDetail = new employeeProfessionalModel(request.body);
        await createProDetail.save();

    
    return response.status(201).json({ message: "Professional details created successfully", data: createProDetail,"success": true });
  }catch(error){
    console.log(error.message);
    response.status(500).json({error:"Internal Server Error",success: false});
  }

}


//Function To Update the record

async function updateProRecord(request,response){
  try{
    const {empPersonalId,employeeId,email,department,designation,dateOfJoining,employmentType,managerId,role,shift,conformation,basic,hra,allowances,total,office,city} = request.body || {};
    const {role:empRole} = request;
    

    if(empRole.toLowerCase() !=='admin')
         return response.status(403).json({ "error": "Access denied. You do not have permission to perform this action.","success":false });

    if(!empPersonalId || !email || !employeeId || !department || !designation || !dateOfJoining || !employmentType  || !managerId  ||  !role || !shift ){
        return response.status(404).json({"error":"Validation Failed Form Fields Missing","success": false});
    } 

    const {empId} = request.params;
    // check if the resord is present

    if(!empId)
      return response.status(400).json({"error":"Record to modify has not been specified","success": false});

      const empRecord = await employeeProfessionalModel.findById(empId);

      if(!empRecord)
        return response.status(400).json({"error":"No Specified Employee found","success": false});

    // structure the object according to schema
    const updateData = {
      empPersonalId,
      employeeId,
      email,
      department,
      conformation: conformation ?? false,
      designation,
      dateOfJoining: new Date(dateOfJoining),
      employmentType,
      managerId,
      role,
      shift,
      salary: { basic, hra, allowances, total },
      workLocation: { office, city },
    };

      // return response.status(200).json({message:"Record Updated Successfully",data:updateData,"success": true});
      await employeeProfessionalModel.updateOne({_id:empId}, {$set:updateData});
      response.status(200).json({message:"Record Updated Successfully",success: true});
  }catch(error){
    console.log(error.message);
    response.status(500).json({"error":"Internal Server Error","success": false});
  }
}

// Function To delete record

async function deleteProRecord(request,response){
  try{

    const {empId} = request.params;
    const {role:empRole} = request;

    if(empRole.toLowerCase() !=='admin')
         return response.status(403).json({ "error": "Access denied. You do not have permission to perform this action.","success":false });

    if(!empId)
      return response.status(400).json({"error":"Employee To Delete Need To Be Specified","success": false});

    const empData = await  employeeProfessionalModel.findById(empId);

    if(!empData)
      return response.status(404).json({"error":"User not found","success": false});

      await employeeProfessionalModel.updateOne({_id:empId},{isActive:false});
    
     response.status(200).json({"message":"Employee Deleted Successfully","success": true});

  }catch(error){
    console.log(error.message);
    response.status(500).send({"error":"Internal Server Error","success": false});
  }
}

// Function To get The reporting manager list
async function getReportingManagerList(request,response){
try{
  const reporingManagerObj = [];

  const papulateList = await employeeProfessionalModel.find().populate('role','name').populate('empPersonalId','firstName lastName').select('firstName lastName name');

  

  if(papulateList.length === 0)
    return response.status(404).json({ error: 'No Reporting Employees Found',success: false});


  const reportingList =  papulateList.filter((value)=>{
        return value['role'].name.toLowerCase() !=='employee';
  }
  );

  // console.log('===>',reportingList);

if(reportingList.length ===0 )
  return response.status(404).json({ error: 'No Reporting Employees Found',success: false});

  response.status(200).json({data:reportingList,success: true});

}catch(error){
  console.log(error.message);
  response.status(500).json({error:"Internal server error",success: false});
}

}

const getAllEmployeesbackupd = async (request,response)=>{
  try{

    const {role:empRole} = request;

    if(empRole.toLowerCase() !=='admin')
      return response.status(403).json({ error: "Access denied. You do not have permission to perform this action.",success:false });

    const [getAllData,empData] = await  Promise.all([employeePersonalModel.find(),employeeProfessionalModel.find().populate('empPersonalId').populate('department','name').populate('designation','name').populate('role','name').populate('shift','name')]);
   
    if(!empData || !getAllData)
      return response.status(200).json({message:"No Records Found",success:true});

    const empProfessionalIds = empData.map((item) => item['empPersonalId']._id.toString()); 
    
    const incompleteRecords = getAllData.filter((value,key)=>{
      return  !empProfessionalIds.includes(value._id.toString());
    });

    const employeeData = [...empData,...incompleteRecords];

    response.status(200).json({message:'employee Reords',data:employeeData,success:true});

  }catch(error){
    console.log(error.message);
    response.status(500).json({error:"Internal Server Error",success:false})
  }
}

const getAllEmployees= async (request,response)=>{
  try{
    const {role:empRole,empId} = request;
    let responseData;
    let totalRecords;
    let managerId;
    const {designation,department,status,role,search,profile,page,limit} = request.query;
     
    const skipCount = (Number(page) - 1)*Number(limit);
    let filter = {department,designation,role,isActive:status};
    const roles = new Set(['manager','admin','hr','tl']);
    if(department==='All')
      delete filter.department;
    if(designation==='All')
      delete filter.designation;
    if(role==='All')
      delete filter.role;

    if(!roles.has(empRole.toLowerCase()))
      return response.status(403).json({ error: "Access denied. You do not have permission to perform this action.",success:false });

    if(empRole.toLowerCase()==='tl'){
      const {empPersonalId} = await employeeProfessionalModel.findById(empId);
      managerId = empPersonalId;
      filter = {managerId} 
    }
    if(search){
        const escapeRegex = (search) => search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const sanitizedSearch = escapeRegex(search.trim());
        filter = {$or: [
          { firstName: { $regex: new RegExp(sanitizedSearch), $options: 'i' } }, 
          { lastName: { $regex: new RegExp(sanitizedSearch), $options: 'i' } }
        ]}
       const PersonalData = await employeePersonalModel.find(filter).skip(skipCount).limit(+limit);
       const refIds = new Set(PersonalData.map(item => item._id.toString()));
       const searchCondition = {empPersonalId: { $in: Array.from(refIds)}};
       if(empRole.toLowerCase()==='tl')
        searchCondition.managerId = managerId;
       responseData = await employeeProfessionalModel.find(searchCondition).populate('empPersonalId').populate('department','name').populate('designation','name').populate('role','name').populate('shift','name');
       totalRecords = await employeePersonalModel.countDocuments(filter);
    }else if(+profile===1){
      console.log(skipCount , +limit);
      const profData = await employeeProfessionalModel.find().select('empPersonalId -_id');
      const refIds = new Set(profData.map(item => item.empPersonalId.toString()));
       responseData = await employeePersonalModel.find({
        _id: { $nin: Array.from(refIds) },  // Exclude _id's that are in refIds
      })
      .skip(skipCount)  // Apply pagination skip
      .limit(limit);
      totalRecords = await employeePersonalModel.countDocuments({
        _id: { $nin: Array.from(refIds) },  // Exclude _id's that are in refIds
      });
    }else{
       totalRecords = await employeeProfessionalModel.countDocuments(filter);
       responseData = await employeeProfessionalModel.find(filter).populate('empPersonalId').populate('department','name').populate('designation','name').populate('role','name').populate('shift','name').skip(skipCount).limit(+limit).lean(true);
    }
    response.status(200).json({message:'employee Reords',data:responseData,success:true,count:totalRecords});
  }catch(error){
    console.log(error.message);
    response.status(500).json({error:"Internal Server Error",success:false})
  }
}

const getAllEmployeesbackup = async (request,response)=>{
  try{
    const {role:empRole} = request;
    const {designation,department,page,limit,search} = request.query;
    const skipCount = (Number(page) - 1)*Number(limit);

    if(empRole.toLowerCase() !=='admin')
      return response.status(403).json({ error: "Access denied. You do not have permission to perform this action.",success:false });

    const [getAllData,empData] = await  Promise.all([employeePersonalModel.find(),employeeProfessionalModel.find().populate('empPersonalId').populate('department','name').populate('designation','name').populate('role','name').populate('shift','name')]);
   
    if(!empData || !getAllData)
      return response.status(200).json({message:"No Records Found",success:true});

    const empProfessionalIds = empData.map((item) => item['empPersonalId']._id.toString()); 
    
    const incompleteRecords = getAllData.filter((value,key)=>{
      return  !empProfessionalIds.includes(value._id.toString());
    });

    const employeeData = [...empData,...incompleteRecords];

    response.status(200).json({message:'employee Reords',data:employeeData,success:true});

  }catch(error){
    console.log(error.message);
    response.status(500).json({error:"Internal Server Error",success:false})
  }
}

// function to reset password

const resetPassword = async(request,response)=>{

  try{
    const {empId} = request.params;
    const {role:empRole} = request;
    const {password,confirmPassword} = request.body;

    if(empRole.toLowerCase() !=='admin')
         return response.status(403).json({ "error": "Access denied. You do not have permission to perform this action.","success":false });
    if(!password || !confirmPassword)
      return response.status(404).json({error:"Validation Failed Form Fields Missing",success: false});

    if(confirmPassword!==password)
      return response.status(400).json({error:"Password and confirm password mismatch",success: false});  

    // encrypting the password
    const saltValue = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,saltValue);
    // Updating the record or password
    const updatedRecord =   await  employeeProfessionalModel.findOneAndUpdate({empPersonalId:empId},{password:hashPassword});

    if(!updatedRecord)
      return response.status(404).json({"error":"User not found","success": false});

    response.status(200).json({data:"",message:"Password Reset Successfull",success:true})

  }catch(error){
    console.log(error.message);
    response.status(500).json({error:"Internal Server Error",success:false})
  }
}

 

export {createProfDetail,updateProRecord,deleteProRecord,getReportingManagerList,getAllEmployees,resetPassword}