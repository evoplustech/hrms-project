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
    console.log(catagoryLink)

    const catagory =  {
      employee : [
        {
          label  :'Create Employee Profile',
          catvalue:'createemployee',
          url : `/home/${tab}/createEmployee`,
          isActive : catagoryLink==='createEmployee' && true || false
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
          url : `/${tab}/createEmployee`,
          isActive : catagoryLink==='createEmployee' && true || false
        },
        {
          label  :'Anncouncement',
          catvalue:'profile',
          url : `/${tab}/employeeList`,
          isActive : catagoryLink==='employeeList' && true || false
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
          label  :'Device Details',
          url : `/home/${tab}`,
          isActive : catagoryLink === 'devices' && true || false
        },
        {
          label  :'Add Device',
          url : `/home/${tab}/adddevice`,
          isActive : catagoryLink === 'adddevice' && true || false
        }
      ],
      leaves : [
        {
          label  :'Leaves',
          url : `/home/${tab}`,
          isActive : catagoryLink === 'leaves' && true || false
        },
        {
          label  :'Leave Requests',
          url : `/home/${tab}/leaverequest`,
          isActive : catagoryLink === 'leaverequest' && true || false
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
      ],
      policy : [
        {
          label  :'Policy List',
          url : `/home/${tab}`,
          isActive : catagoryLink === 'policy' && true || false

        },
        {
          label  :'Add Policy',
          url : `/home/${tab}/addpolicy`,
          isActive : catagoryLink === 'addpolicy' && true || false
        }
      ],
      holiday: [
        {
          label: "Holiday List",
          url: `/home/${tab}`,
          isActive : catagoryLink === 'holiday' && true || false
        },
        {
          label: "Add Holiday",
          url: `/home/${tab}/addholiday`,
          isActive : catagoryLink === 'addholiday' && true || false
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

