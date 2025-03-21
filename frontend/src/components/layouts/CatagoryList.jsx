import React from 'react'
import { Link } from 'react-router-dom'
import useSelectorHook from '../../../utils/useSelectorHook';

const CatagoryList = ({value}) => {
<<<<<<< HEAD
  console.log('catlistststsststt',value);
  return (
    <>
      <li className={`${value.isActive?'bg-teal-100':''} hover:cursor-pointer hover:bg-teal-100  py-2 bg-gray-300 px-2 rounded-s-xl rounded-e-xl font-semibold`}><Link to={value.url}>{value.label}</Link></li>
=======
  const {isLogged, data} = useSelectorHook('authenticateUser');
  let show_hide = false;

  const hide_component = ['Add Policy','Add Holiday'];
  if(hide_component.includes(value.label) && data.role.name.toLowerCase() !== 'admin' ){
    show_hide = false;
  }else{
    show_hide = true;
  }

  return (
    <>  
    { show_hide ? 
      <li><Link className={`${value.isActve?'bg-teal-100':''} hover:cursor-pointer hover:bg-teal-100  py-2 bg-gray-300 px-2 rounded-s-xl rounded-e-xl font-semibold`} to={value.url}>{value.label}</Link></li>:''
    }
>>>>>>> Features
    </>
  )
}

export default CatagoryList