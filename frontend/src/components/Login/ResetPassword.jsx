import React, { useRef, useState } from 'react'
import LoginHeader from './LoginHeader';
import { LiaEyeSolid } from "react-icons/lia";
import { RiEyeOffLine } from "react-icons/ri";
import { RiEyeLine } from "react-icons/ri";
import { useNavigate, useParams } from 'react-router-dom';
import useResetPassword from '../../hooks/useResetPassword';
import toast from 'react-hot-toast';
import LoadingIcons from 'react-loading-icons';

const ResetPassword = () => {

    const [password,setPassword]  = useState('');
    const [confirmpassword,setConfirmPassword]  = useState('');
    const [passtoggle,setpassToggle] = useState(false);
    const [conPasstoggle,setConpassToggle] = useState(false);
    const passref = useRef();
    const confpassref = useRef();

    const navigate = useNavigate();
    const {empId,token} = useParams();
    const [loading,resetPassword] = useResetPassword();

    const createPasswordHandler = async (e)=>{
      e.preventDefault();
     const result =  await resetPassword({password,confirmpassword,empId,token});

      if(result.success){
        toast.success(result.message);
        navigate('/');
      }else{
         toast.error(result.error);
      }
    }

    const togglePasswordType=(param)=>{
      setpassToggle(param);
      param?passref.current.type = 'text':passref.current.type = 'password';
    }

    const toggleConfirmPassType=(param)=>{
      setConpassToggle(param);
      param?confpassref.current.type = 'text':confpassref.current.type = 'password';
    }



  

  return (
    <>
      <div className="flex flex-col justify-center items-center login-page">
      <LoginHeader/>
        <div className="flex flex-col items-center justify-center ">
          <div  className=' max-w-md w-full p-6 rounded-lg shadow-md bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0'>
          <h1 className="mb-6 p-2 text-gray-600 text-2xl font-semibold">HRMS Employee Portal</h1>
          <p className="mb-6 mt-0 pb-2 flex justify-center items-center text-gray-600 text-xl font-semibold">Reset Password</p>
            <form className="space-y-4" onSubmit = {createPasswordHandler}>
              <div className="mx-0">
                <label className="block text-base font-semibold text-gray-700 mb-1">
                    password
                </label>
                <input ref={passref} onChange={(e)=>(setPassword(e.target.value))} value={password}  type="password" placeholder='create Password' className="m-2 ps-3 pr-10 w-full h-10 rounded-md relative" /><span className="absolute transform  -translate-x-10 translate-y-5">{
                    passtoggle?<RiEyeLine className='hover:cursor-pointer w-5 h-5 z-50' onClick = {()=>(togglePasswordType(!passtoggle))} />:<RiEyeOffLine className='hover:cursor-pointer w-5 h-5 z-50' onClick = {()=>(togglePasswordType(!passtoggle))} />
                  }</span>
              </div>
              <div className="mx-0">
                <label className="block text-base font-semibold text-gray-700 mb-1">
                    Confirm password
                </label>
                <input ref={confpassref} onChange={(e)=>(setConfirmPassword(e.target.value))} value={confirmpassword}  type="password" placeholder='Confirm Password' className="m-2 ps-3 pr-10 w-full h-10 rounded-md" /><span className="absolute transform  -translate-x-10 translate-y-5">
                  {
                    conPasstoggle?<RiEyeLine className='hover:cursor-pointer w-5 h-5 z-50' onClick = {()=>(toggleConfirmPassType(!conPasstoggle))} />:<RiEyeOffLine className='hover:cursor-pointer w-5 h-5 z-50' onClick = {()=>(toggleConfirmPassType(!conPasstoggle))} />
                  }</span>
              </div>
              {/* <Link to="/" className="hover:text-blue-500 hover:cursor-pointer hover:text-md">Back To Login</Link> */}
              <button disabled={loading?true:false} className='bg-yellow-200 w-full p-2 mt-4 rounded-md hover:bg-green-800 text-md'>  
                {
                  loading?<span className="flex justify-center" ><LoadingIcons.ThreeDots className="w-8" /> Loading</span>:'Reset Password'
                
                } 
                         
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPassword