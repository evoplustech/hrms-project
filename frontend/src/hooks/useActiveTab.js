import useSelectorHook from '../../utils/useSelectorHook';
import { useLocation } from 'react-router-dom';

const useActiveTab = () => {
  try{
     
    const  url = useLocation();
    const {data} = useSelectorHook('authenticate');
    const path = url.pathname;
    const urlarray = path.split('/');
    let tab = urlarray[2];
    let catagoryLink = path.split('/')[urlarray.length-1];

    const catagory =  {
      employee : [
        {
          label  :'Create Employee Profile',
          catvalue:'createemployee',
          url : `/home/${tab}/createEmployee`,
          isActve : catagoryLink==='createEmployee' && true || false
        },
        {
          label  :'Employee List',
          catvalue:'employeelist',
          url : `/home/${tab}/employeeList`,
          isActive : catagoryLink==='employeeList' && true || false
        },{
          label:'My Profile',
          catvalue:'profile',
          url:`/home/${tab}`,
          isActive : catagoryLink==='employee' && true || false
        }
      ],
      home : [
        {
          label  :'Organization',
          catvalue:'profile',
          url : `/${tab}/createEmployee`
        },
        {
          label  :'Anncouncement',
          catvalue:'profile',
          url : `/${tab}/employeeList`
        }
      ],
      attendance : [
        {
          label  :'All Attendance',
          catvalue:'allattendance',
          url : `/home/${tab}/allAttendance`,
          isActive : catagoryLink==='allAttendance' && true || false
        },
        {
          label  :'My Attendance',
          catvalue:'myattendance',
          url : `/home/${tab}/${data.employeeId}`,
          isActive : isNaN(+catagoryLink) ? false : true
        },
        {
          label  :'Attendance Request',
          catvalue:'myattendance',
          url : `/home/${tab}/AttendanceRequest`,
          isActive : catagoryLink==='AttendanceRequest' && true || false
        }
      ],
      devices : [
        {
          label  :'Organization',
          catvalue:'profile',
          url : `/${tab}/createEmployee`
        },
        {
          label  :'Anncouncement',
          catvalue:'profile',
          url : `/${tab}/employeeList`
        }
      ],
      leaves : [
        {
          label  :'Leave Requests',
          catvalue:'profile',
          url : `/${tab}/createEmployee`
        },
        {
          label  :'Apply Leave',
          catvalue:'profile',
          url : `/${tab}/employeeList`
        }
      ],
      configuration : [
        {
          label  :'Modules',
          catvalue:'profile',
          url : `/home/${tab}/`
        },
        {
          label  :'Dummy',
          catvalue:'profile',
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

