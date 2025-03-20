import React from 'react'
import { Link } from 'react-router-dom'

const CatagoryList = ({value}) => {
  console.log('catlistststsststt',value);
  return (
    <>
      <li className={`${value.isActive?'bg-teal-100':''} hover:cursor-pointer hover:bg-teal-100  py-2 bg-gray-300 px-2 rounded-s-xl rounded-e-xl font-semibold`}><Link to={value.url}>{value.label}</Link></li>
    </>
  )
}

export default CatagoryList