import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'


const Biometric = () => {


    return (
        // <div className="w-4/5 m-auto p-6 bg-gray-200 border-2 rounded-lg">
            <main className=" mt-36 w-full p-6  ms-6 me-2 mb-40">
                <Outlet></Outlet>
            </main>
        // </div> 
    )
}

export default Biometric