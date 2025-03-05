import React from 'react'
import { Link } from 'react-router-dom'

const Notauthorize = () => {
  return (<>
        <h1 className='text-3xl bg-gray-300 min-h-[50%] text-center p-10 text-red-700'> Your not authorized this to access this module.</h1>
        <Link to="/home" className='text-blue-500 underline'>Goto Home Page</Link>  
    </>)
}

export default Notauthorize