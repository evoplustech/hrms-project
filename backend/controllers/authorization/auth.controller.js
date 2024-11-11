import bcrypt from 'bcrypt';
import generateJWTtoken from "../../helpers/JWT.js";
import employeeProfessionalModel from "../../models/employee/EmployeeProfessional.model.js";


const loginEmployee = async (request,response)=>{
    try{

      const {username,password} = request.body;

      if(!username || !password)
        return response.status(400).json({"error":"Username or password is Missing"});

      

        const empRecord = await employeeProfessionalModel.findOne({email:username}).populate('empPersonalId','firstName lastName profilepic');
        
        if(!empRecord)
          return response.status(401).json({"error":"Invalid Credentials"});

        const {password : hashPassword} = empRecord;
        // decrypt the password from db to verify
        const passwordVerify =  await bcrypt.compare(password,hashPassword || '');
        if(!passwordVerify)
          return response.status(401).json({"error":"Invalid Credentials"});

        const {_id,role} =  empRecord;

        // creating JWT for the user
        generateJWTtoken({_id,role},response);

        console.log(empRecord);
        const {firstName,lastName,profilepic} = empRecord.empPersonalId;
        response.status(200).json({_id,firstName,lastName,profilepic});

    }catch(error){
      console.log(error.message);
      response.status(500).json({"error":"Internal Server Error"});
    }
} 

const logOutEmployee = async (request,response)=>{
  try{
    // Clear the 'webtoken' cookie
    response.cookie("webtoken","",{
      maxAge: 0
    })
    // Send success response
    response.status(200).json({"message":"Employee Logout Successfull"});

  }catch(error){
    console.log(error.message);
    // Send error response
    response.status(500).json({"error":"Internal Server Error"})
  }
}

export {loginEmployee,logOutEmployee};