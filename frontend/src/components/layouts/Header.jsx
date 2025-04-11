import React from 'react'
import { LogOutMiddleware } from '../../slices/authSlice';
import { useDispatch } from 'react-redux';
import Catogary from './Catogary';

const Header = () => {

  const dispatch = useDispatch();
  
  const LogOutHandler = async()=>{
    try{
      const result = await dispatch(LogOutMiddleware());
      // return toast.error('');
    }catch(error){
      console.log(error);
    }
  }

  return (
    <>
<nav className="fixed bg-gray-800 mt-0 w-full h-18 z-50">
  <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div className=" flex h-16 items-center justify-between">
      <div className="flex flex-1 items-center justify-around sm:items-stretch ">
        <div className="hidden sm:ml-6 sm:block">
          <div className="flex space-x-4">
            {/* <a href="#" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Dashboard</a>
            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
            <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a> */}
          </div>
        </div>
      </div>
      <button className="transform translate-x-40 rounded-full p-2 space-x-3  flex ms-center sm:static sm:inset-auto sm:ml-6 sm:pr-0 hover:text-md " onClick={LogOutHandler}>
        <div className="icon h-6 w-6 hover: fill-text-green-600" style={{"color": "rgb(255, 255, 255)"}}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><path fill="none" strokeWidth="2" d="M13,9 L13,2 L1,2 L1,22 L13,22 L13,15 M22,12 L5,12 M17,7 L22,12 L17,17"></path></svg></div>
        <div className="mr-3 text-white hover:text-green-400" >Log Out</div>
      </button>
      
      
    </div>
  </div>

  
  <div className="sm:hidden" id="mobile-menu">
    <div className="space-y-1 px-2 pb-3 pt-2">
      
      <a href="#" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</a>
      <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
      <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
      <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
    </div>
  </div>
</nav>
    
    </>
  )
}

export default Header