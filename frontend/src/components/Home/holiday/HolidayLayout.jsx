import React from 'react'
import { Outlet } from 'react-router-dom'

const HolidayLayout = () => {
  return (
    <main className=" mt-32 w-full px-6  ms-6 me-2 mb-40">
        <Outlet />
    </main>
  )
}

export default HolidayLayout