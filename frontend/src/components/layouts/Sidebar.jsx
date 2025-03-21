import React, { useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoChevronBackCircleOutline,IoChevronForwardCircleOutline  } from "react-icons/io5";
import { AiOutlinePieChart } from "react-icons/ai";
import { GiTimeBomb,GiIsland } from "react-icons/gi";
import { IoFingerPrint } from "react-icons/io5";
import { TbSettingsCog } from "react-icons/tb";
import { Link } from 'react-router-dom';
import useSelectorHook from '../../../utils/useSelectorHook';
<<<<<<< HEAD

const Sidebar = ({tab}) => {

const [sidebarToggle,setToggle]= useState(false);
console.log('toggle state=> ',sidebarToggle);
const {data} = useSelectorHook('authenticate');
=======
import { MdPolicy } from "react-icons/md";
import { MdOutlineHolidayVillage } from "react-icons/md";

const Sidebar = ({tab}) => {

const [ sidebarToggle, setToggle ]= useState(false);
const { isLogged, data } = useSelectorHook('authenticateUser');

// console.log('toggle state=> ',sidebarToggle);

>>>>>>> Features
const active = 'text-orange-600 bg-orange-100';

const imgSize = {
  true : 'h-12 w-12',
  false : 'h-24 w-24 border-4'
}
const sideWidth = {
  true : 'w-24',
  false: ''
}

  return (
<>
  <div className=" min-w-fit  relative min-h-screen  bg-orange-200 z-50 rounded-e-3xl">
    {
      sidebarToggle ? 
      <button className="absolute transform translate-y-20 translate-x-16  ms-3" onClick={()=>(setToggle(!sidebarToggle))}><IoChevronForwardCircleOutline fill="currentColor" stroke="currentColor" className="fill-orange-500 stroke-orange-500 h-8 w-8 rounded-full hover:cursor-pointer"/></button>
      :
      <button className="absolute transform translate-y-20 translate-x-56  m-2" onClick={()=>(setToggle(!sidebarToggle))}><IoChevronBackCircleOutline className="fill-orange-500 stroke-orange-500 h-8 w-8 rounded-full hover:cursor-pointer"/></button>
    }
    <aside className={`shadow-lg h-full p-2 ${sideWidth[sidebarToggle]}`}>
      <div className="p-4 flex flex-col items-center text-center">
        {/* <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" className={` border-gray-300 rounded-full ${imgSize[sidebarToggle]}`} /> */}
        <img src={data.profilepic} alt="Profile" className={` border-gray-300 rounded-full ${imgSize[sidebarToggle]}`} />
        {sidebarToggle ? '':
        <div className="ml-3">
          <h2 className="text-lg font-bold">{data.firstName} {data.lastName}</h2>
          <p className="text-sm text-gray-500">{data.role.name}</p>
        </div>
        }
      </div>
      {sidebarToggle ? '':
      <div>
        <input type="text" placeholder="search" className="rounded-full p-2 bg-slate-100 focus:outline-none  focus:outline-blue-300"/><button className=" absolute  mt-2  transform  -translate-x-8 "><IoIosSearch className="w-6 h-6 "/></button>
      </div> 
      }
      <nav className="mt-6">
        <div className="space-y-2">
          <Link to="/home" className={`px-4 py-2 flex font-semibold  rounded-e-full  ${tab ==='home'? active :''}`}>
            <AiOutlinePieChart className="w-6 h-6 me-2 text-orange-600"/>{sidebarToggle ? '':'Dashboard'}
          </Link>
          <Link to="/home/employee" className= {`px-4 py-2 font-semibold flex hover:bg-orange-100 hover:text-orange-600 rounded-e-full ${tab==='employee' ? active:''}`}><FaPeopleGroup className="w-6 h-6 me-2 text-orange-600"/>
          {sidebarToggle ? '':'Employee Management'}
          </Link>
          <Link to={`/home/attendance/${data.employeeId}`} className={`px-4 py-2  font-semibold flex hover:bg-orange-100 hover:text-orange-600 rounded-e-full ${tab==='attendance' ? active:''}`}><GiTimeBomb className="w-6 h-6 me-2 text-orange-600"/>
          {sidebarToggle ? '':'Attendance'}</Link>
          {data.role.name.toLowerCase() === 'admin'&&<Link to="/home/devices" className={`px-4 py-2 font-semibold flex hover:bg-orange-100 hover:text-orange-600 rounded-e-full ${tab==='devices' ? active:''}`}><IoFingerPrint  className="w-6 h-6 me-2 text-orange-600"/>
          {sidebarToggle ? '':'Bio-Metric'}</Link>}
          <Link to="/home/leaves" className={`px-4 py-2 font-semibold flex hover:bg-orange-100 hover:text-orange-600 rounded-e-full ${tab==='leaves' ? active:''}`}><GiIsland  className="w-6 h-6 me-2 text-orange-600"/>
          {sidebarToggle ? '':'Leave'}</Link>
          <Link to="/home/configuration" className={`px-4 py-2 font-semibold flex hover:bg-orange-100 hover:text-orange-600 rounded-e-full ${tab==='configuration' ? active:''}`}><TbSettingsCog  className="w-6 h-6 me-2 text-orange-600"/>
          {sidebarToggle ? '':'Configuration'}</Link>

          <Link to="/home/policy" className={`px-4 py-2 font-semibold flex hover:bg-orange-100 hover:text-orange-600 rounded-e-full ${tab==='policy' ? active:''}`}><MdPolicy  className="w-6 h-6 me-2 text-orange-600"/>
          {sidebarToggle ? '':'Policy'}</Link>

          <Link to="/home/holiday" className={`px-4 py-2 font-semibold flex hover:bg-orange-100 hover:text-orange-600 rounded-e-full ${tab==='holiday' ? active:''}`}>
            <MdOutlineHolidayVillage className='w-6 h-6 me-2 text-orange-600'/>
            {sidebarToggle ? '':'Holiday'}
          </Link>

        </div>
      </nav>
    </aside>
    
  </div>
</>
   
  )
}

export default Sidebar