import React from 'react'
import { Link } from 'react-router-dom'
import useSelectorHook from '../../../utils/useSelectorHook';

const CatagoryList = ({value}) => {
  console.log('catlistststsststt',value);
  
  const {isLogged, data} = useSelectorHook('authenticate');
  let show_hide = false;

  const hide_component = ['Add Policy','Add Holiday'];
  if(hide_component.includes(value.label) && data.role.name.toLowerCase() !== 'admin' ){
    show_hide = false;
  }else{
    show_hide = true;
  }
  console.log("Catagory")
  console.log(value.isActive)
  return (
    <>  
    { show_hide ? 
      <li><Link className={`${value.isActive?'bg-teal-100':''} hover:cursor-pointer hover:bg-teal-100  py-2 bg-gray-300 px-2 rounded-s-xl rounded-e-xl font-semibold`} to={value.url}>{value.label}</Link></li>:''
    }
    </>
  )
}

export default CatagoryList