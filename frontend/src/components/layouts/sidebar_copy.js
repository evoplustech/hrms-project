import React, { useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { AiOutlinePieChart } from "react-icons/ai";
import { GiTimeBomb } from "react-icons/gi";
import { IoFingerPrint } from "react-icons/io5";
import { GiIsland } from "react-icons/gi";
import { Link } from 'react-router-dom';

const Sidebar = () => {

const [sidebarToggle,setToggle]= useState(false);
console.log('toggle state=> ',sidebarToggle);

  return (
<>
  <div className=" min-w-fit  relative min-h-screen  bg-orange-200 z-50 rounded-e-3xl">
  <button className="absolute transform translate-y-20 translate-x-64 ms-3" onClick={()=>(setToggle(!sidebarToggle))}><IoChevronBackCircleOutline className="fill-blue-400 h-8 w-8 rounded-full hover:cursor-pointer"/></button>
    <aside className="shadow-lg h-full p-2">
      <div className="p-4 flex flex-col items-center">
        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" className="border-4 border-gray-300 rounded-full h-24 w-24" />
        <div className="ml-3">
          <h2 className="text-lg font-bold">Aaron Hamilton</h2>
          <p className="text-sm text-gray-500">Regional HR Manager</p>
        </div>
      </div>
      <div>
        <input type="text" placeholder="search" className="rounded-full p-2 bg-slate-100 focus:outline-none  focus:outline-blue-300"/><button className=" absolute  mt-2  transform  -translate-x-8 "><IoIosSearch className="w-6 h-6 "/></button>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2">
          <li className="px-4 py-2 flex text-orange-600 font-semibold bg-orange-100 rounded-e-full">
            <AiOutlinePieChart className="w-6 h-6 me-2"/>
            <Link to="/home">Dashboard</Link>
          </li>
          <li className="px-4 py-2 flex hover:bg-orange-100 hover:text-orange-600 rounded-e-full">
            <FaPeopleGroup className="w-6 h-6 me-2 text-orange-600"/>
            <Link to="/home/employee">Employee Management</Link>
          </li>
          <li className="px-4 py-2 flex hover:bg-orange-100 hover:text-orange-600 rounded-e-full">
            <GiTimeBomb className="w-6 h-6 me-2 text-orange-600"/>
            <Link to="/home/attendance">Attendance</Link>
          </li>
          <li className="px-4 py-2 flex hover:bg-orange-100 hover:text-orange-600 rounded-e-full">
            <IoFingerPrint  className="w-6 h-6 me-2 text-orange-600"/>
            <Link to="/home/devices">Bio-Metric</Link>
          </li>
          <li className="px-4 py-2 flex hover:bg-orange-100 hover:text-orange-600 rounded-e-full">
            <GiIsland  className="w-6 h-6 me-2 text-orange-600"/>
            <Link to="/home/leaves">Leave</Link>
          </li>
          
        </ul>
      </nav>
    </aside>
    
  </div>
</>
   
  )
}

export default Sidebar