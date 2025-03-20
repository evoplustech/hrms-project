import { useEffect, useMemo, useState } from "react";
import httpRequest from "../../utils/httpRequest";


const useGetData = (param)=>{
  const [loading,setLoading] = useState(false);
  const [list,setList] = useState([]);
  let {path,method, params,data} = param;
  const memodata = useMemo(()=>param,[JSON.stringify(param)]);
    useEffect(()=>{
        const sendRequest = async()=>{
          try{
            setLoading(true);
            const responseData = await httpRequest(param);
            if(responseData.success)
              setList(responseData.data);
          }catch(error){
              
          }finally{
            setLoading(false);
          }
        }

        sendRequest();
    },[memodata]);
    return [loading,list];
}

export default useGetData;








