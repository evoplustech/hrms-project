import { useRef } from "react";


export const useDebounce = (func,delay)=>{
  const timer = useRef(null);
  const debouncedFunction = (args)=>{
    if(timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(()=>{
      func(args);
    },delay);

  }
  return debouncedFunction;
}

