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
import Module from './components/home/cofiguration/Module';
import { getModules } from './slices/moduleSlice';
import { fetchAttendance } from './slices/attendanceSlice';
import { fetchReasons } from './slices/reasonSlice';
import { getAttendanceRequest } from './slices/attendanceRequestSlice';
















const App = React.lazy(()=>import('./App'));
const Home = React.lazy(()=>import('./components/home/Home'));
const Login = React.lazy(()=>import('./components/Login/Login'));
const ForgetPassword = React.lazy(()=>import('./components/Login/ForgetPassword'));
const ResetPassword = React.lazy(()=>import('./components/Login/ResetPassword'));
const EmployeeManagement = React.lazy(()=>import('./components/home/employee/EmployeeManagement'));
const Dashboard = React.lazy(()=>import('./components/home/dashboard/Dashboard'));
const Attendance = React.lazy(()=>import('./components/home/attendance/Attendance'));
const BIometric = React.lazy(()=>import('./components/home/devices/BIometric'));
const Leave = React.lazy(()=>import('./components/home/leave/Leave'));
const Configuration = React.lazy(()=>import('./components/home/cofiguration/Configuration'));
const PersonalDetailsForm = React.lazy(()=>import('./components/home/employee/PersonalDetailsForm'));
const ProfessionalDetailsForm = React.lazy(()=>import('./components/home/employee/ProfessionalDetailsForm'));
const EmployeeList = React.lazy(()=>import('./components/home/employee/EmployeeList'));
const UpdateEmployee = React.lazy(()=>import('./components/home/employee/UpdateEmployee'));
const EmployeeProfile = React.lazy(()=>import('./components/home/employee/EmployeeProfile'));
const Myattendance = React.lazy(()=>import('./components/home/attendance/Myattendance'));
const AllAttendance = React.lazy(()=>import('./components/home/attendance/AllAttendance'));
const AttendanceRequest = React.lazy(()=>import('./components/home/attendance/AttendanceRequest'));



const BaseComponent = ()=>{
  const dispatch = useDispatch();
  const loggedData =(localStorage.getItem("emplog") || '');
  const {employeeId,empPersonalId} = JSON.parse(loggedData || '{}') ;
  // console.log('loggedData',empPersonalId );

  useEffect(()=>{
    console.log('hello world');
    async function  storeData(){
      await dispatch(fetchAllEmployees());
      await dispatch(fetchAllDepartment());
      await dispatch(fetchAllRoles());
      await dispatch(fetchAllDesignation());
      await dispatch(fetchAllShifts());
      await dispatch(getModules());
      await dispatch(fetchAttendance({id:employeeId,dateParam:new Date()}));
      await dispatch(fetchReasons());

      // /api/attendance/getRequest?empid=${empid}&id=${id}&startDate=${startDate}&endDate=${endDate}&status=${status}&requestType=${requestType}&page=2&limit=1`

      // api/attendance/getRequest?empid=${empid}&id=${id}&page=${page}&limit=${limit}
      await dispatch(getAttendanceRequest({empid:empPersonalId._id,id:employeeId,status:'All',requestType:1,page:1,limit:10}));
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
          element:<Suspense>{isLogged ?<Navigate to="/home"><Home/></Navigate>:<Login/>}</Suspense>
        },{
          path:'/home',
          element:<Suspense>{isLogged ?<Home/>:<Navigate to="/"><Login/></Navigate>}</Suspense>,
          children:[
            {
              path:'/home/',
              element:<Suspense><Dashboard/></Suspense>
            },
            {
              path:'/home/employee',
              element:<Suspense><EmployeeManagement/></Suspense>,
              children:[
                {
                  path:'/home/employee/',
                  element:<Suspense><EmployeeProfile/></Suspense>
                },
                {
                  path:'/home/employee/createEmployee',
                  element:<Suspense><PersonalDetailsForm/></Suspense>
                },
                {
                  path:'/home/employee/createEmployee/:id',
                  element:<Suspense><ProfessionalDetailsForm/></Suspense>
                },
                {
                  path:'/home/employee/employeeList',
                  element:<Suspense><EmployeeList/></Suspense>
                }
                ,
                {
                  path:'/home/employee/updateEmployee/:empObj',
                  element:<Suspense><UpdateEmployee/></Suspense>
                }
              ]
             
            },
            {
              path:'/home/attendance',
              element:<Suspense><Attendance/></Suspense>,
              children:[
                {
                  path:'/home/attendance/:id/',
                  element:<Suspense><Myattendance/></Suspense>
                },
                {
                  path:'/home/attendance/allAttendance',
                  element:<Suspense><AllAttendance/></Suspense>
                },{
                  path:'/home/attendance/AttendanceRequest',
                  element:<Suspense><AttendanceRequest/></Suspense>
                }
              ]
            },
            {
              path:'/home/devices',
              element:<Suspense><BIometric/></Suspense>
            },
            {
              path:'/home/leaves',
              element:<Suspense><Leave/></Suspense>
            },{
              path:'/home/configuration',
              element:<Suspense><Configuration/></Suspense>,
              children:[{
                path:'/home/configuration/',
                element:<Suspense><Module/></Suspense>,
              }]
            }
          ]
        },{
          path:'/forget-password',
          element:<Suspense>{isLogged ?<Navigate to="/home"><Home/></Navigate>:<ForgetPassword/>}</Suspense>
        },{
          path:'/reset-password/:empId/:token',
          element:<Suspense>{isLogged ?<Navigate to="/home"><Home/></Navigate>:<ResetPassword/>}</Suspense>
        }
    ]
    }
  ])

  return (
    <RouterProvider router = {Router}></RouterProvider>
  )

}

export default BaseComponent;