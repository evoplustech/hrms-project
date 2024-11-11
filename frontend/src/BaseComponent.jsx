import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './Home';
import Test from './Test';
import ErrorBoundary from '../utils/ErrorBoundary';


const BaseComponent = ()=>{

  const Router = createBrowserRouter([
    {
    path:'/',
    element : <ErrorBoundary><App/></ErrorBoundary>,
    children : [
        {
          path:'/',
          element:<ErrorBoundary><Home/></ErrorBoundary>
        },{
          path:'/test',
          element:<ErrorBoundary><Test/></ErrorBoundary>
        }
    ]
    }
  ])

  return (
    <RouterProvider router = {Router}></RouterProvider>
  )

}

export default BaseComponent;