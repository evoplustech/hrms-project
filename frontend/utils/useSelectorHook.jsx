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
    case 'authenticateuser' : return (state)=>(state.authenticate);
  }
}

export default useSelectorHook;