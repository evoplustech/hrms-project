import { split } from 'postcss/lib/list';
import React from 'react'
import { useLocation } from 'react-router-dom'

const useActiveTab = () => {
  try{
     
    const  url = useLocation();
    const path = url.pathname;
    const urlarray = path.split('/');
    let tab = urlarray[2];
    let catagoryLink = path.split('/')[urlarray.length-1];

    const catagory =  {
      employee : [
        {
          label  :'Create Employee Profile',
          url : `/home/${tab}/createEmployee`,
          isActve : catagoryLink==='createEmployee' && true || false
        },
        {
          label  :'Employee List',
          url : `/home/${tab}`,
          isActve : catagoryLink==='employee' && true || false
        }
      ],
      home : [
        {
          label  :'Organization',
          url : `/${tab}/createEmployee`
        },
        {
          label  :'Anncouncement',
          url : `/${tab}/employeeList`
        }
      ],
      attendance : [
        {
          label  :'Organization',
          url : `/${tab}/createEmployee`
        },
        {
          label  :'Anncouncement',
          url : `/${tab}/employeeList`
        }
      ],
      devices : [
        {
          label  :'Device Details',
          url : `/home/${tab}`,
          isActve : catagoryLink === 'devices' && true || false
        },
        {
          label  :'Add Device',
          url : `/home/${tab}/adddevice`,
          isActve : catagoryLink === 'adddevice' && true || false
        }
      ],
      leaves : [
        {
          label  :'Leave Requests',
          url : `/${tab}/createEmployee`
        },
        {
          label  :'Apply Leave',
          url : `/${tab}/employeeList`
        }
      ],
      configuration : [
        {
          label  :'Modules',
          url : `/home/${tab}/`
        },
        {
          label  :'Dummy',
          url : `/${tab}/employeeList`
        }
      ]
    }

    if(!catagory[tab])
      tab='home';

    const subCatagory = catagory[tab];
    
    
    return [tab,subCatagory];

  }catch(error){
    console.log(error.message);
  }

}

export default useActiveTab;

