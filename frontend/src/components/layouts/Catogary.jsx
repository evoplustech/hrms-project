import React from 'react'
import CatagoryList from './CatagoryList'

const Catogary = ({subCatagory}) => {
  let categoryList = [...subCatagory];
   
  return (
    <div className="flex fixed p-3 bg-gray-100 mt-16 w-full z-50">
       <div className="mx-72">
          <ul className="flex flex-row space-x-4">
            {
              categoryList.map((value)=>(
                <CatagoryList key={value.label} value={value}/>
              ))
            }
            
            {/* <li className="hover:cursor-pointer hover:bg-teal-100  py-2 bg-gray-300 px-2 rounded-s-xl rounded-e-xl font-semibold"><a href="">Create Employee Profile</a></li>
            <li className="hover:cursor-pointer hover:bg-teal-100  py-2 bg-gray-300 px-2 rounded-s-xl rounded-e-xl font-semibold"><a href="">Employees List</a></li> */}
          </ul>
       </div>
    </div>
  )
}

export default Catogary