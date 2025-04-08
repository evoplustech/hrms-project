
import React from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import  { Toaster } from 'react-hot-toast';



function App() {
 
  const url = useLocation();
  const urlparam = url.pathname.split('/');

  return (
    <>
    {/* url.pathname=='/' || url.pathname=='/forget-password' || url.pathname=='/reset-password' */}
    <div className={`ms-auto h-screen ${(urlparam[1]!=='home')?'login':''}`}>
        <Outlet></Outlet>
        <Toaster/>
    </div>
    </>
  )
}

export default App
