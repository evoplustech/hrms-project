import { useState } from "react";

const useForgetPassword = ()=>{

  const [loading,setLoading] = useState(false);
  // const navigate = useNavigate();

  const requestPassword = async (username)=>{
      try{
        setLoading(true);

        if(!username)
            return {error:'userName cannot be empty',success:false}
          
        if(!username.match(/.+\@.+\..+/))
          return {error:'username format is invalid',success:false}        

         const response = await fetch('/api/authorize/forget-password',{
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify({username})
         });

         const result = await response.json();

         if(!result.success)
          throw new Error('Server Error');
        
        return {message:'Successfull! Password Reset Link Sent To Your Email',success:true}
       
      }catch(error){
        return {message:error.message,success:false}
       
      }finally{
        setLoading(false);
      }
  }

  return [loading,requestPassword];


}

export default useForgetPassword;

