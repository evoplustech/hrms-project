import bcrypt from 'bcrypt';
import generateJWTtoken from "../../helpers/JWT.js";
import employeeProfessionalModel from "../../models/employee/EmployeeProfessional.model.js";
import nodemailer from  'nodemailer';
import jwt from 'jsonwebtoken'
import ip6  from 'ip6'



const loginEmployee = async (request,response)=>{
    try{
      
      const {username,password} = request.body;

      if(!username || !password)
        return response.status(400).json({error:"Username or password is Missing",success:false});

        const empIsActive = await employeeProfessionalModel.findOne({email:username,isActive:false})

        if(empIsActive){
          return response.status(200).json({error:"Your account is inactive. Please reach out to our support team or admin team for help.",success: false});
        }

        const empRecord = await employeeProfessionalModel.findOne({email:username}).populate('designation','name').populate('department','name').populate('empPersonalId').populate('role','name').populate('managerId','firstName lastName').populate('shift','name');
        
        if(!empRecord)
          return response.status(401).json({error:"Invalid Credentials",success:false});

        const {password : hashPassword} = empRecord;
        // decrypt the password from db to verify
        const passwordVerify =  await bcrypt.compare(password,hashPassword || '');
        if(!passwordVerify)
          return response.status(401).json({error:"Invalid Credentials",success:false});

        const {_id,role} =  empRecord;

        // creating JWT for the user
        generateJWTtoken({_id,role},response);

        // console.log(empRecord);
        const {firstName,lastName,profilepic} = empRecord.empPersonalId;
        
        response.status(200).json({data:empRecord,success:true});

    }catch(error){
      console.log(error.message);
      response.status(500).json({error:"Internal Server Error",success:false});
    }
} 

const logOutEmployee = async (request,response)=>{
  try{
    // Clear the 'webtoken' cookie
    response.cookie("webtoken","",{
      maxAge: 0
    })
    // Send success response
    response.status(200).json({message:"Employee Logout Successfull",success:true});

  }catch(error){
    console.log(error.message);
    // Send error response
    response.status(500).json({error:"Internal Server Error",success:false})
  }
}

const processPasswordRequest = async(request,response)=>{
  try{

    const ip_address = ip6.address();
    const {username} = request.body;

    if(!username)
      return response.status(400).json({error:"Username is Missing",success:false});

      const empRecord = await employeeProfessionalModel.findOne({email:username,isActive:true});

      if(!empRecord)
        return response.status(401).json({error:"Invalid Credentials",success:false});

      const token = jwt.sign({id:empRecord._id},process.env.RESET_KEY,{expiresIn:24*60*60*1000});

      const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
          user:"hadleydavid46@gmail.com",
          pass : "wkbitekdorrmwnle"
        }
      });

      const receiver = {
        from:"hadleydavid46@gmail.com",
        to:username,
        subject:"Password Reset Link",
        html:`<h2 style="color:navy,fontSize:12px">Click On the Below Link To Reset Your Hrms Password<h2><br/><a href="http://${ip_address}:5173/reset-password/${empRecord._id}/${token}">http://localhost:5173/reset-password/${empRecord._id}/${token}</a>`
      }

      // console.log(receiver);

      await  transporter.sendMail(receiver,(error,emailResponse)=>{
         if(error)
          console.log(error);

        return response.status(200).json({message:"Password Resest Link Sent To Your Email Account",success:true});
      })


    
  }catch(error){
    console.log(error.message);
    response.status(500).json({error:"Internal Server Error",success:false});
  }
}

const resetPassword = async (request,response)=>{
  try{

    const {password,confirmpassword} = request.body;
    const {empId,token} = request.params;

    if(!password || !confirmpassword || !empId || !token)
      response.status(400).json({error:"Missing Data For Update",success:false})

    if(password !== confirmpassword)
      response.status(400).json({error:"Password mismatch with confirm password",success:false})


    const empRecord = await employeeProfessionalModel.findOne({_id:empId,isActive:true});

    if(!empRecord)
      response.status(404).json({error:"No Record Found",success:false})

    const authToken = jwt.verify(token,process.env.RESET_KEY);

    const saltValue = await bcrypt.genSalt(10);  
    const hashedPassword = await bcrypt.hash(password,saltValue);

   const updatedRecord =  await employeeProfessionalModel.updateOne({_id:empId,isActive:true},{$set:{password:hashedPassword}});


   if(updatedRecord.matchedCount ===0 &&  updatedRecord.modifiedCount===0)
     response.status(404).json({error:"Record Not Updated.. Try again",success:false})
    

   response.status(200).json({error:"Password  Updated Succefully",success:true})

  }catch(error){
    console.log(error.message);
    if(error.name==='TokenExpiredError')
      response.status(401).json({error:"Your Token Has Expired Request Agian",error:false})
    else if(error.name==='JsonWebTokenError')
      response.status(401).json({error:"Invalid Token Provided",error:false})
    else
      response.status(500).json({error:"Internal Server Error",success:false});
  }
}

export {loginEmployee,logOutEmployee,processPasswordRequest,resetPassword};