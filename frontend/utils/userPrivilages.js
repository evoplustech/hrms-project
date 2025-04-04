
const accessPrivilages = (role)=>{
  const roleType = role.toLowerCase() || "";
    switch(roleType){
      case 'admin': return ['profile','create_employee','employee_list','all_attendance','my_attendance','attendance_request','device_detail','add_device','leaves','leave_request','policy',,'add_policy','holiday_list','add_holiday','module'];break;
      case 'hr' : return ['profile','create_employee','employee_list','all_attendance','my_attendance','attendance_request','leaves','leave_request','policy','add_policy','holiday_list','add_holiday',''];break;
      case 'manager' : return ['profile','all_attendance','my_attendance','attendance_request','leaves','leave_request','policy','holiday_list'];break;
      case 'tl': return ['profile','all_attendance','my_attendance','attendance_request','leaves','leave_request','policy','holiday_list'];break;
      case 'employee' : return ['profile','my_attendance','attendance_request','leaves','leave_request','policy','holiday_list'];break;
      default : return [''];
    }
}

export default accessPrivilages;