
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import  { Toaster } from 'react-hot-toast';



function App() {
 
  const url = useLocation();
 console.log(url.pathname);

  return (
    <>
    {/* url.pathname=='/' || url.pathname=='/forget-password' || url.pathname=='/reset-password' */}
    <div className={`ms-auto h-screen ${(url.pathname!=='/home')?'login':''}`}>
        <Outlet></Outlet>
        <Toaster/>
    </div>
    </>
  )
}

export default App
