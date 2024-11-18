import React ,{Suspense} from 'react'
import { createBrowserRouter,Navigate,RouterProvider } from 'react-router-dom';
// import App from './App';
// import Home from './Home';
// import Test from './Test';
// import ErrorBoundary from '../utils/ErrorBoundary';
import useSelectorHook from '../utils/useSelectorHook';





const App = React.lazy(()=>import('./App'));
const Home = React.lazy(()=>import('./components/Home/Home'));
const Login = React.lazy(()=>import('./components/Login/Login'));
const ForgetPassword = React.lazy(()=>import('./components/Login/ForgetPassword'));
const ResetPassword = React.lazy(()=>import('./components/Login/ResetPassword'));


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
          element:<Suspense>{isLogged ?<Home/>:<Navigate to="/"><Login/></Navigate>}</Suspense>
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