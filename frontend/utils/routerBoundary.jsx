// import React from 'react'
import React from 'react'
import { useLocation } from 'react-router-dom'


export const routerBoundary=(UpdatedErrorBoundary)=>{

    const  UpdatedBoundary=(props)=>{
        const location = useLocation();
        return (
          <UpdatedErrorBoundary location = {location} {...props} />
        )
    }
    return UpdatedBoundary;

} 