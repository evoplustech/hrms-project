import React ,{Suspense, useEffect, useMemo} from 'react'
import { createBrowserRouter,Navigate,RouterProvider } from 'react-router-dom';
// import App from './App';
// import Home from './Home';
// import Test from './Test';
// import ErrorBoundary from '../utils/ErrorBoundary';
import useSelectorHook from '../utils/useSelectorHook';
import { useDispatch } from 'react-redux';
import { fetchAllEmployees } from './slices/employeeSlice';
import { fetchAllDepartment } from './slices/departmentSlice';
import { fetchAllDesignation } from './slices/designationSlice';
import { fetchAllRoles } from './slices/roleSlice';
import { fetchAllShifts } from './slices/shiftSlice';
import { fetchBiometricDevice } from './slices/biometricSlice'
// import Module from './components/home/cofiguration/Module';
// import { getModules } from './slices/moduleSlice';
import { fetchAttendance } from './slices/attendanceSlice';
import { fetchReasons } from './slices/reasonSlice';
import { getAttendanceRequest } from './slices/attendanceRequestSlice';


import { fetchPolicy } from './slices/policySlice';
import { fetchLeaves } from './slices/leaveSlice';
import { getLeaveTypes } from './slices/leavetypeSlice';
import HolidayLayout from './components/Home/holiday/HolidayLayout';
import HolidayList from './components/Home/holiday/HolidayList';
import AddHoliday from './components/Home/holiday/AddHoliday';
import { getHolidayList } from './slices/holidaySlice';
import currentMonthDates from '../utils/dateOfMonth';
import CronEditor from './components/Home/cofiguration/CronEditor';
import Biometric from './components/Home/devices/Biometric';














const App = React.lazy(()=>import('./App'));
const Home = React.lazy(()=>import('./components/Home/Home'));
const Login = React.lazy(()=>import('./components/Login/Login'));
const ForgetPassword = React.lazy(()=>import('./components/Login/ForgetPassword'));
const ResetPassword = React.lazy(()=>import('./components/Login/ResetPassword'));
const EmployeeManagement = React.lazy(()=>import('./components/Home/employee/EmployeeManagement'));
const Dashboard = React.lazy(()=>import('./components/Home/dashboard/Dashboard'));
const Attendance = React.lazy(()=>import('./components/Home/attendance/Attendance'));
// const Biometric = React.lazy(()=>import('./components/Home/devices/Biometric'));
const Leave = React.lazy(()=>import('./components/Home/leave/Leave'));
const Configuration = React.lazy(()=>import('./components/Home/cofiguration/Configuration'));
const PersonalDetailsForm = React.lazy(()=>import('./components/Home/employee/PersonalDetailsForm'));
const ProfessionalDetailsForm = React.lazy(()=>import('./components/Home/employee/ProfessionalDetailsForm'));
const EmployeeList = React.lazy(()=>import('./components/Home/employee/EmployeeList'));
const UpdateEmployee = React.lazy(()=>import('./components/Home/employee/UpdateEmployee'));
const EmployeeProfile = React.lazy(()=>import('./components/Home/employee/EmployeeProfile'));
const Myattendance = React.lazy(()=>import('./components/Home/attendance/Myattendance'));
const AllAttendance = React.lazy(()=>import('./components/Home/attendance/AllAttendance'));
const AttendanceRequest = React.lazy(()=>import('./components/Home/attendance/AttendanceRequest'));
const  PicklistEditor = React.lazy(()=> import('./components/Home/cofiguration/PicklistEditor'));


const BiometricDeviceList = React.lazy(()=>import('./components/Home/devices/BiometricDeviceList'))
const AddDevice = React.lazy(()=>import('./components/Home/devices/AddDevice'));
const Policy = React.lazy(()=>import('./components/Home/policy/Policy'));
const PolicyList = React.lazy(()=>import('./components/Home/policy/PolicyList'));
const AddPolicy  = React.lazy(()=>import('./components/Home/policy/AddPolicy'));
const LeaveList = React.lazy(()=> import('./components/Home/leave/LeaveList'));
const LeaveRequest = React.lazy(()=> import('./components/Home/leave/LeaveRequest'));



const BaseComponent = ()=>{
  const dispatch = useDispatch();
  const loggedData =(localStorage.getItem("emplog") || '');
  const {employeeId,empPersonalId} = JSON.parse(loggedData || '{}') ;
   const [firstDayOfMonth,lastDayOfMonth] = currentMonthDates();
  
  // console.log('loggedData',empPersonalId );

  useEffect(()=> {
    // console.log('hello world');
    function storeData(){
      const user = JSON.parse(localStorage.getItem("emplog"));
      const year = new Date().getFullYear();
      const holidaystartDate = `${year}-01-01`;
      const holidayendDate = `${year}-12-31`;
      const roleType= new Set(['manager','admin','hr','tl']);
      const params = { "startDate":holidaystartDate, "endDate":holidayendDate };

      if(user !== null){
        dispatch(getHolidayList(params))
      
        if(roleType.has(user.role.name.toLowerCase())) dispatch(fetchAllEmployees({
          designation : "All",department:"All",status : true,role : "All",search :"",profile: "0",page :1,limit:10
        }));
      
        dispatch(fetchAllDepartment());
        dispatch(fetchAllRoles());
        dispatch(fetchAllDesignation());
        dispatch(fetchAllShifts());
        // dispatch(getModules());
        dispatch(fetchAttendance({id:employeeId,dateParam:new Date()}));
        dispatch(fetchReasons());
        dispatch(fetchLeaves({ "status":"", "AppliedStartDate": "", "AppliedEndDate": "", "mine": "", "page": "1", "limit": "10"}))
        dispatch(getLeaveTypes())
        dispatch(fetchPolicy())

        if(user.role.name.toLowerCase() === 'admin') dispatch(fetchBiometricDevice());
        const urlData = {empid:empPersonalId._id,id:employeeId,startDate:firstDayOfMonth,endDate:lastDayOfMonth,status:'All',requestType:1,page:1,limit:10};
        dispatch(getAttendanceRequest(urlData));
      }
    }
    storeData();
  },[loggedData]);

  const {isLogged} = useSelectorHook('authenticate');
  const Router = createBrowserRouter([
    {
    path:'/',
    element : <Suspense fallback={<p className="font-semibold text-xl">Loading...</p>}><App/></Suspense>,
    children : [
        {
          path:'/',
          element:<Suspense>{isLogged ?<Navigate to="/Home"><Home/></Navigate>:<Login/>}</Suspense>
        },{
          path:'/Home',
          element:<Suspense>{isLogged ?<Home/>:<Navigate to="/"><Login/></Navigate>}</Suspense>,
          children:[
            {
              path:'/Home/',
              element:<Suspense><Dashboard/></Suspense>
            },
            {
              path:'/Home/employee',
              element:<Suspense><EmployeeManagement/></Suspense>,
              children:[
                {
                  path:'/Home/employee/',
                  element:<Suspense><EmployeeProfile/></Suspense>
                },
                {
                  path:'/Home/employee/createEmployee',
                  element:<Suspense><PersonalDetailsForm/></Suspense>
                },
                {
                  path:'/Home/employee/createEmployee/:id',
                  element:<Suspense><ProfessionalDetailsForm/></Suspense>
                },
                {
                  path:'/Home/employee/employeeList',
                  element:<Suspense><EmployeeList/></Suspense>
                }
                ,
                {
                  path:'/Home/employee/updateEmployee/:empObj',
                  element:<Suspense><UpdateEmployee/></Suspense>
                }
              ]
             
            },
            {
              path:'/Home/attendance',
              element:<Suspense><Attendance/></Suspense>,
              children:[
                {
                  path:'/Home/attendance/:id/',
                  element:<Suspense><Myattendance/></Suspense>
                },
                {
                  path:'/Home/attendance/allAttendance',
                  element:<Suspense><AllAttendance/></Suspense>
                },{
                  path:'/Home/attendance/AttendanceRequest',
                  element:<Suspense><AttendanceRequest/></Suspense>
                }
              ]
            },
            {
              path:'/Home/devices',
              element:<Suspense><Biometric/></Suspense>,
              children:[
                {
                  path:'/Home/devices/',
                  element:<Suspense><BiometricDeviceList /></Suspense>
                },{
                  path:'/Home/devices/adddevice',
                  element:<Suspense><AddDevice/></Suspense>,
                },{
                  path:'/Home/devices/adddevice/:id',
                  element:<Suspense><AddDevice/></Suspense>,
                }
              ]
            },
            {
              path:'/Home/leaves',
              element:<Suspense> <Leave/> </Suspense>,
              children: [
                {
                  path:'/Home/leaves/',
                  element: <Suspense> <LeaveList /> </Suspense>
                },
                {
                  path:'/Home/leaves/leaverequest',
                  element: <Suspense> <LeaveRequest /> </Suspense>
                }
              ]
            },{
              path:'/Home/configuration',
              element:<Suspense><Configuration/></Suspense>,
              children:[
                {
                path:'/Home/configuration/picklist',
                element:<Suspense><PicklistEditor/></Suspense>,
                },
                {
                  path:'/Home/configuration/cronsetup',
                  element:<Suspense><CronEditor/></Suspense>,
                 }
              ]
            },{
              path:'/Home/policy',
              element:<Suspense><Policy /></Suspense>,
              children:[
                {
                  path:'/Home/policy',
                  element:<Suspense><PolicyList/></Suspense>,
                },
                {
                  path:'/Home/policy/addpolicy',
                  element:<Suspense><AddPolicy/></Suspense>,
                  
                },{
                  path:'/Home/policy/addpolicy/:polidyId',
                  element:<Suspense><AddPolicy/></Suspense>,
                }
              ]
            },{
              path: "/Home/holiday",
              element: <Suspense><HolidayLayout /></Suspense>,
              children: [
                {
                  path: "/Home/holiday",
                  element: <Suspense><HolidayList /></Suspense>
                },
                {
                  path: "/Home/holiday/addholiday",
                  element: <Suspense><AddHoliday /></Suspense>
                },{
                  path: "/Home/holiday/addholiday/:id",
                  element: <Suspense><AddHoliday /></Suspense>
                }
              ]
            }

          ]
        },{
          path:'/forget-password',
          element:<Suspense>{isLogged ?<Navigate to="/Home"><Home/></Navigate>:<ForgetPassword/>}</Suspense>
        },{
          path:'/reset-password/:empId/:token',
          element:<Suspense>{isLogged ?<Navigate to="/Home"><Home/></Navigate>:<ResetPassword/>}</Suspense>
        }
    ]
    },{
      path:'*',
      element:<section class="bg-white dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center">
              <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
              <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
              <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
              <a href="#" class="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back to Homepage</a>
          </div>   
      </div>
  </section>
    }
  ]);

  return (
    <RouterProvider router = {Router}></RouterProvider>
  )

}

export default BaseComponent;
