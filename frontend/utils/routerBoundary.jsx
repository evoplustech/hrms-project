// import React from 'react'
import { useLocation } from 'react-router-dom'

export   const routerBoundary=(ErrorBoundarys)=>{

    const  UpdatedBoundary=(props)=>{
        const location = useLocation();
        console.log(location);
        return (
          <>
          <ErrorBoundarys location = {location} {...props}></ErrorBoundarys>
          </>
        )
    }
    return UpdatedBoundary;

} 