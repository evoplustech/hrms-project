import React ,{Suspense} from 'react'
import { createBrowserRouter,Navigate,RouterProvider } from 'react-router-dom';
// import App from './App';
// import Home from './Home';
// import Test from './Test';
// import ErrorBoundary from '../utils/ErrorBoundary';
import useSelectorHook from '../utils/useSelectorHook';











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
const PersonalDetailsForm = React.lazy(()=>import('./components/home/employee/PersonalDetailsForm'));
const ProfessionalDetailsForm = React.lazy(()=>import('./components/home/employee/ProfessionalDetailsForm'));
const EmployeeList = React.lazy(()=>import('./components/home/employee/EmployeeList'));


const BaseComponent = ()=>{

  const {isLogged} = useSelectorHook('authenticateUser');
console.log(isLogged);
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
              ]
             
            },
            {
              path:'/home/attendance',
              element:<Suspense><Attendance/></Suspense>
            },
            {
              path:'/home/devices',
              element:<Suspense><BIometric/></Suspense>
            },
            {
              path:'/home/leaves',
              element:<Suspense><Leave/></Suspense>
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