import React, { useState } from 'react'
import { IoMdArrowDropdown,IoIosList,IoMdArrowDropright  } from 'react-icons/io';
import { TbSettingsCog } from 'react-icons/tb';
import { ImLoop } from "react-icons/im";
import { Link } from 'react-router-dom';

const ConfigurationTab = ({tab,active,sidebarToggle}) => {

  const [isOpen, setIsOpen] = useState(false);
  

  return (
    <>
   
      <div id="accordion-collapse" data-accordion="collapse">
        <h2 id="accordion-collapse-heading-1">
          <button
            type="button"
            className=""
            onClick={()=>setIsOpen(!isOpen)} // Toggle on button click
            aria-expanded={isOpen} // Dynamically update aria-expanded based on the state
            aria-controls="accordion-collapse-body-1"
          >
             <div to="/home/configuration" className={`px-4 py-2 flex hover:bg-orange-100 hover:text-orange-600 rounded-e-full ${tab==='configuration' ? active:''}`}><TbSettingsCog  className="w-6 h-6 me-2 text-orange-600"/>
             {sidebarToggle ? '':'Configuration'}{isOpen ? <IoMdArrowDropright className="ms-1 h-6 w-6 pt-1"/>:<IoMdArrowDropdown className="ms-1 h-6 w-6 pt-1"/>} </div>
          </button>
        </h2>
        <div
          id="accordion-collapse-body-1"
          className={`transition-all duration-300 ${isOpen ? 'block' : 'hidden'} flex flex-col justify-start items-start ${sidebarToggle ? 'ms-8':'ms-14' }`} // Toggle visibility based on isOpen
          aria-labelledby="accordion-collapse-heading-1"
        >
          <Link to={'/home/configuration/picklist'} className={`flex justify-start mt-2 px-2 py-1 border  hover:bg-orange-100 hover:text-orange-600 rounded-e-full cursor-pointer`}>
          <span className="flex justify-center items-center"><IoIosList className="me-2 w-4 h-4 text-lime-900" />{sidebarToggle ? '':'Picklist Editor'}</span>
          </Link>
          <Link to={'/home/configuration/cronsetup'} className={`flex justify-start mt-2 px-2 py-1 border   hover:bg-orange-100 hover:text-orange-600 rounded-e-full cursor-pointer`}>
          <span className="flex justify-center items-center"><ImLoop className="me-2 w-4 h-4 text-cyan-900" />{sidebarToggle ? '':'Cron SetUp'}</span>
          </Link>
        </div>
    </div>
    </>
  )
}

export default ConfigurationTab