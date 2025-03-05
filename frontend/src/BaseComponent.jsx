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
import Module from './components/home/cofiguration/Module';
import { getModules } from './slices/moduleSlice';
import { fetchPolicy } from './slices/policySlice';
import { fetchLeaves } from './slices/leaveSlice';
import { getLeaveTypes } from './slices/leavetypeSlice';













const App = React.lazy(()=>import('./App'));
const Home = React.lazy(()=>import('./components/home/Home'));
const Login = React.lazy(()=>import('./components/Login/Login'));
const ForgetPassword = React.lazy(()=>import('./components/Login/ForgetPassword'));
const ResetPassword = React.lazy(()=>import('./components/Login/ResetPassword'));
const EmployeeManagement = React.lazy(()=>import('./components/home/employee/EmployeeManagement'));
const Dashboard = React.lazy(()=>import('./components/home/dashboard/Dashboard'));
const Attendance = React.lazy(()=>import('./components/home/attendance/Attendance'));
const Biometric = React.lazy(()=>import('./components/home/devices/Biometric'));
const Leave = React.lazy(()=>import('./components/home/leave/Leave'));
const Configuration = React.lazy(()=>import('./components/home/cofiguration/Configuration'));
const PersonalDetailsForm = React.lazy(()=>import('./components/home/employee/PersonalDetailsForm'));
const ProfessionalDetailsForm = React.lazy(()=>import('./components/home/employee/ProfessionalDetailsForm'));
const EmployeeList = React.lazy(()=>import('./components/home/employee/EmployeeList'));
const UpdateEmployee = React.lazy(()=>import('./components/home/employee/UpdateEmployee'));
const BiometricDeviceList = React.lazy(()=>import('./components/home/devices/BiometricDeviceList'))
const AddDevice = React.lazy(()=>import('./components/home/devices/AddDevice'));
const Policy = React.lazy(()=>import('./components/home/policy/Policy'));
const PolicyList = React.lazy(()=>import('./components/home/policy/PolicyList'));
const AddPolicy  = React.lazy(()=>import('./components/home/policy/AddPolicy'));
const LeaveList = React.lazy(()=> import('./components/home/leave/LeaveList'));
const LeaveRequest = React.lazy(()=> import('./components/home/leave/LeaveRequest'));

const BaseComponent = ()=>{
  const dispatch = useDispatch();
  const loggedData =(localStorage.getItem("emplog") || '');
  

  useEffect(()=>{
    // console.log('hello world');
    async function storeData(){
      const user = JSON.parse(localStorage.getItem("emplog"));
      
      await dispatch(fetchAllEmployees());
      await dispatch(fetchAllDepartment());
      await dispatch(fetchAllRoles());
      await dispatch(fetchAllDesignation());
      await dispatch(fetchAllShifts());
      await dispatch(getModules());
      // await dispatch(fetchBiometricDevice());
      await dispatch(fetchLeaves({ "status":"", "AppliedStartDate": "", "AppliedEndDate": "", "mine": "", "page": "1", "limit": "10"}))
      dispatch(getLeaveTypes())
      await dispatch(fetchPolicy())

      if(user.role.name.toLowerCase() === 'admin') dispatch(fetchBiometricDevice());

    }
    storeData();
  },[loggedData]);

  const {isLogged} = useSelectorHook('authenticateUser');
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
                  element:<Suspense><EmployeeList/></Suspense>
                },
                {
                  path:'/home/employee/createEmployee',
                  element:<Suspense><PersonalDetailsForm/></Suspense>
                },
                {
                  path:'/home/employee/createEmployee/:id',
                  element:<Suspense><ProfessionalDetailsForm/></Suspense>
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
              element:<Suspense><Attendance/></Suspense>
            },
            {
              path:'/home/devices',
              element:<Suspense><Biometric/></Suspense>,
              children:[
                {
                  path:'/home/devices/',
                  element:<Suspense><BiometricDeviceList /></Suspense>
                },{
                  path:'/home/devices/adddevice',
                  element:<Suspense><AddDevice/></Suspense>,
                },{
                  path:'/home/devices/adddevice/:id',
                  element:<Suspense><AddDevice/></Suspense>,
                }
              ]
            },
            {
              path:'/home/leaves',
              element:<Suspense><Leave/></Suspense>,
              children: [
                {
                  path:'/home/leaves/',
                  element: <Suspense><LeaveList /></Suspense>
                },
                {
                  path:'/home/leaves/leaverequest',
                  element: <Suspense><LeaveRequest /></Suspense>
                }
              ]
            },{
              path:'/home/configuration',
              element:<Suspense><Configuration/></Suspense>,
              children:[{
                path:'/home/configuration/',
                element:<Suspense><Module/></Suspense>,
              }]
            },{
              path:'/home/policy',
              element:<Suspense><Policy /></Suspense>,
              children:[
                {
                  path:'/home/policy',
                  element:<Suspense><PolicyList/></Suspense>,
                },
                {
                  path:'/home/policy/addpolicy',
                  element:<Suspense><AddPolicy/></Suspense>,
                  
                },{
                  path:'/home/policy/addpolicy/:polidyId',
                  element:<Suspense><AddPolicy/></Suspense>,
                  
                }
              ]
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
