import React from 'react'
import Footer from '../../layouts/Footer'
import { Outlet } from 'react-router-dom'


const EmployeeManagement = () => {



  return (
    <>
    {/* w-4/5 */}
      <main className=" mt-36 w-full  p-6  ms-6 me-2 mb-40">
          <Outlet></Outlet>
      </main>
    </>
  )
}

export default EmployeeManagement