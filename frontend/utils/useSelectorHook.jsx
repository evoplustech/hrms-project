import React from 'react'
import { useSelector } from 'react-redux'

const useSelectorHook = (param) => {
  
    try{
      const stateData = pickStateSelector(param);
      const selectState = useSelector(stateData);
      return selectState;
    }catch(error){
      console.log(error.message);
      throw error;
    }
}

const pickStateSelector = (param)=>{
  const slice = param.toLowerCase();

  switch(slice){
    case 'authenticateuser' : return (state)=>(state.authenticate);
    case 'employee' : return (state)=>(state.employee);
    case 'role' : return (state)=>(state.role);
    case 'department' : return (state)=>(state.department);
    case 'designation' : return (state)=>(state.designation);
    case 'shift' : return (state)=>(state.shift);
    case 'module' : return (state)=>(state.module);
    case 'biometric': return (state) => (state.biometric);
    case 'policy': return (state)=> (state.policy);
    case 'leave': return (state) => (state.leave);
    case 'leavetype': return (state) => (state.leavetype);
    case "holiday": return (state)=> (state.holiday);

  }
}

export default useSelectorHook;