import React from 'react'
import { useSelector } from 'react-redux'

const useSelectorHook = (param) => {
  
    try{
      const stateData = pickStateSelector(param);
      const selectState = useSelector(stateData);
      return selectState;
    }catch(error){
      console.log(error.message);
    }
}

const pickStateSelector = (param)=>{
  const slice = param.toLowerCase();

  switch(slice){
    case 'authenticate' : return (state)=>(state.authenticate);
    case 'employee' : return (state)=>(state.employee);
    case 'role' : return (state)=>(state.role);
    case 'department' : return (state)=>(state.department);
    case 'designation' : return (state)=>(state.designation);
    case 'shift' : return (state)=>(state.shift);
    case 'module' : return (state)=>(state.module);
    case 'attendance' : return (state)=>(state.attendance);
    case 'reason' : return (state)=>(state.reason);
    case 'attendancerequest': return (state)=>(state.attendanceRequest)
  }
}

export default useSelectorHook;