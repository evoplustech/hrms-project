import React, { useState } from 'react'
import LoginHeader from './LoginHeader';
import { Link } from 'react-router-dom';
import useForgetPassword from '../../hooks/useForgetPassword.js';
import toast from 'react-hot-toast';
import LoadingIcons from 'react-loading-icons';

const ForgetPassword = () => {

  const [username,setUsername] = useState('');
  const [loading,requestPassword] = useForgetPassword();

  const forgetformHandler = async (e)=>{
    e.preventDefault();

    const result = await requestPassword(username);

    if(result.success)
      toast.success(result.message);
    else
      toast.error(result.error);

  }



  return (
    <>
    <div className="flex flex-col justify-center items-center login-page pt-10">
     <LoginHeader/>
      <div className="flex flex-col items-center justify-center ">
        <div  className=' max-w-md w-full p-6 rounded-lg shadow-md bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0'>
        <h1 className="mb-6 p-2 text-gray-600 text-2xl font-semibold">HRMS Employee Portal</h1>
        <p className="mb-6 mt-0 pb-2 flex justify-center items-center text-gray-600 text-xl font-semibold">Request Password</p>
          <form className="space-y-4" onSubmit = {forgetformHandler}>
            <div className="mx-0">
              <label className="block text-base font-semibold text-gray-700 mb-1">
                  Username  
              </label>
              <input onChange={(e)=>(setUsername(e.target.value))} value={username}  type="text" placeholder=' abc@xyz.com' className="m-2 p-4 w-full h-10 rounded-md" />
            </div>
            <Link to="/" className="hover:text-blue-500 hover:cursor-pointer hover:text-md">Back To Login</Link>
            <button disabled={loading?true:false} className='bg-yellow-200 w-full p-2 mt-4 rounded-md hover:bg-green-800 text-md'>   
                {
                  loading?<span className="flex justify-center" ><LoadingIcons.ThreeDots className="w-8" /> Loading</span>:'Send Request'
                }      
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default ForgetPassword