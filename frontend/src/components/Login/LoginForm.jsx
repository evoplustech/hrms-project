import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import {  LoginMiddleware } from '../../slices/authSlice';
import { useDispatch} from 'react-redux'; 
import LoadingIcons from 'react-loading-icons' 
import useSelectorHook from '../../../utils/useSelectorHook';
import { Link, Navigate } from 'react-router-dom';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { fetchAllEmployees } from '../../slices/employeeSlice';

const LoginForm = () => {

  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [togglehide,setToggleHide] = useState(false);
  const passref = useRef()
  const dispatch = useDispatch();
  const {status} = useSelectorHook('authenticate'); 
  
  // console.log(useSelectorHook('authenticate'));
  // console.log(username,password,status);

  const loginFormSubmit = async (e)=>{
    try{
        e.preventDefault();
      if(!username || !password)
        return toast.error('Credentials Missing ! Please Enter Username And Password');

      const response = await dispatch(LoginMiddleware({username,password}));
      if(response.payload.error)
        // return toast.error('Login Failed! Invalid Credentials');
      return toast.error(response.payload.error,{duration:5000})

      
    }catch(error){
      console.log(error.message);
    }
  }

  const toggleHandler = (param)=>{
      setToggleHide(param);
      param?passref.current.type = 'text':passref.current.type = 'password';
  }
  


  return (
    <div className="flex flex-col items-center justify-center ">
      <div  className=' max-w-md w-full p-6 rounded-lg shadow-md bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0'>
        <h1 className="mb-6 p-2 text-gray-600 text-2xl font-semibold">HRMS Employee Portal</h1>
        <form className="space-y-4" onSubmit = {loginFormSubmit}>
          <div className="">
            <label className="block text-base font-semibold text-gray-700 mb-1">
                Username  
            </label>
            <input onChange={(e)=>(setUsername(e.target.value))} value={username}  type="text" placeholder='Enter username' className="m-2 p-4 w-full h-10 rounded-md" />
          </div>
          <div className="relative w-full">
            <label className="block text-base font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input ref={passref} onChange={(e)=>(setPassword(e.target.value))} value={password} type="password" placeholder='Enter password' className="m-2 ps-2 pe-6 w-full h-10 rounded-md" />
              <span className="absolute top-1/2 -right-1 transform mt-4  -translate-y-1/2">{
                togglehide?<RiEyeLine className='hover:cursor-pointer w-5 h-5 z-50' onClick = {()=>(toggleHandler(!togglehide))} />:<RiEyeOffLine className='hover:cursor-pointer w-5 h-5 z-50' onClick = {()=>(toggleHandler(!togglehide))} />
              }</span>
          </div>
          <div>
            <div>
              <Link to="/forget-password" className="hover:text-blue-500 hover:cursor-pointer hover:text-md">Forget Password ? Let's Reset </Link>
            </div>
          <button disabled={status==="pending"?true:false} className='bg-green-400 w-full p-2 mt-4 rounded-md hover:bg-green-800 hover:text-xl'>
            {
              status==="pending"?<span className="flex justify-center" ><LoadingIcons.ThreeDots className="w-8" /></span>:'Login Portal'
            }
            
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm;