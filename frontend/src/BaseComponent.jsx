import React ,{Suspense} from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
// import App from './App';
// import Home from './Home';
// import Test from './Test';
import ErrorBoundary from '../utils/ErrorBoundary';

const App = React.lazy(()=>import('./App'));
const Home = React.lazy(()=>import('./Home'));
const Test = React.lazy(()=>import('./Test'));


const BaseComponent = ()=>{

  const Router = createBrowserRouter([
    {
    path:'/',
    element : <Suspense fallback={<p ClassName="font-semibold text-xl">Loading...</p>}><App/></Suspense>,
    children : [
        {
          path:'/',
          element:<Suspense><Home/></Suspense>
        },{
          path:'/test',
          element:<Suspense><Test/></Suspense>
        }
    ]
    }
  ])

  return (
    <RouterProvider router = {Router}></RouterProvider>
  )

}

export default BaseComponent;