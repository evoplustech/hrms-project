import { useState } from "react";



const useResetPassword = ()=>{

  const [loading,setLoading] = useState();
  

  const resetPassword = async ({password,confirmpassword,empId,token})=>{
    try{
      setLoading(true);
      if(!empId || !token)
        throw new Error('Reset Password Time Expired try again');
      if(!password || !confirmpassword)
        return {error:'fields Missing , Enter Password and confirmPassword',success:false}
       
      if(password.length < 6)
        return {error:'Password Must Be Of 6 Characters',success:false}
        
      if(password !== confirmpassword)
        return {error:'Mismatch Confirm password is Not Same as  Password',success:false}
        

      const response = await fetch(`/api/authorize/reset-password/${empId}/${token}`,{
        method:"PATCH",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({password,confirmpassword})
      });

      const result=await response.json();

      if(!result.success)
        return {error:'Password Reset Failed,Contact Your Admin',success:false}
      else
        return {message:'Password Reset Successful!',success:true}

    }catch(error){
      return {error:error.message,success:false}
    }finally{
      setLoading(false);
    }
  }

  return [loading,resetPassword];


}

export default useResetPassword;