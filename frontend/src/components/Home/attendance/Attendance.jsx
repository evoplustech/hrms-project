import React from 'react'
import { Outlet } from 'react-router-dom'

const Attendance = () => {
  return (
    <main className="mt-36 w-full  p-6  ms-6 me-2 mb-40 ">
      <Outlet></Outlet>
    </main>
  )
}

export default Attendance




