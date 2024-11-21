import React from 'react'
import { LogOutMiddleware } from '../../slices/authSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

const Sidebar = () => {

  const dispatch = useDispatch();
  
    const LogOutHandler = async()=>{
      try{
      const result = await dispatch(LogOutMiddleware());
      console.log(result);        
        // return toast.error('');
    }catch(error){
      console.log(error);
    }
    }

  return (
    <div>
      <button onClick={LogOutHandler}>LogOut</button>
    </div>
  )
}

export default Sidebar