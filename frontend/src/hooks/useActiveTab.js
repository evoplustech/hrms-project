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
          label:'My Profile',
          catvalue:'profile',
          url:`/home/${tab}`,
          isActive : catagoryLink==='employee' && true || false
        },
        {
          label  :'Create Employee Profile',
          catvalue:'create_employee',
          url : `/home/${tab}/createEmployee`,
          isActive : catagoryLink==='createEmployee' && true || false
        },
        {
          label  :'Employee List',
          catvalue:'employee_list',
          url : `/home/${tab}/employeeList`,
          isActive : catagoryLink==='employeeList' && true || false
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
          catvalue:'all_attendance',
          url : `/home/${tab}/allAttendance`,
          isActive : catagoryLink==='allAttendance' && true || false
        },
        {
          label  :'My Attendance',
          catvalue:'my_attendance',
          url : `/home/${tab}/${data.employeeId}`,
          isActive : isNaN(+catagoryLink) ? false : true
        },
        {
          label  :'Attendance Request',
          catvalue:'attendance_request',
          url : `/home/${tab}/AttendanceRequest`,
          isActive : catagoryLink==='AttendanceRequest' && true || false
        }
      ],
      devices : [
        {
          label  :'Device Details',
          url : `/home/${tab}`,
          catvalue:'device_detail',
          isActive : catagoryLink === 'devices' && true || false
        },
        {
          label  :'Add Device',
          url : `/home/${tab}/adddevice`,
          catvalue:'add_device',
          isActive : catagoryLink === 'adddevice' && true || false
        }
      ],
      leaves : [
        {
          label  :'Leaves',
          catvalue : "leaves",
          url : `/home/${tab}`,
          isActive : catagoryLink === 'leaves' && true || false
        },
        {
          label  :'Leave Requests',
          catvalue : "leave_request",
          url : `/home/${tab}/leaverequest`,
          isActive : catagoryLink === 'leaverequest' && true || false
        }
      ],
      configuration : [
        {
          label  :'Modules',
          catvalue:'module',
          url : `/home/${tab}/`,
          isActive : catagoryLink === 'configuration' && true || false
        }
      ],
      policy : [
        {
          label  :'Policy List',
          catvalue : "policy",
          url : `/home/${tab}`,
          isActive : catagoryLink === 'policy' && true || false

        },
        {
          label  :'Add Policy',
          catvalue: "add_policy",
          url : `/home/${tab}/addpolicy`,
          isActive : catagoryLink === 'addpolicy' && true || false
        }
      ],
      holiday: [
        {
          label: "Holiday List",
          catvalue: "holiday_list",
          url: `/home/${tab}`,
          isActive : catagoryLink === 'holiday' && true || false
        },
        {
          label: "Add Holiday",
          catvalue: "add_holiday",
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

