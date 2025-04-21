import React from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { fetchAttendance } from '../../../slices/attendanceSlice';

const GridView = ({employeeId,name,email,designation,department,pic}) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dataSubmitHandler = async (param)=>{
      console.log(param);
      await dispatch(fetchAttendance({id:param,dateParam:new Date()}));
      navigate(`/home/attendance/${employeeId}`);

  }

  return (
    <>
        {/* <Link to={`/home/attendance/${employeeId}`} > */}
        <button onClick = {()=>dataSubmitHandler(employeeId)}>
          <div className="w-96 empgrid-wrap bg-gray-200 border-2 border-l-slate-900">
              <div className="flex space-x-6  items-center my-2 ps-2 ">
                  <div className="relative emp-grid-photo">
                    <img className="rounded-full w-20 h-20 hover:absolute hover:transition-all  hover:duration-300" src={pic}  alt="no image found"/>
                  </div>
                  
                
                  <div className="">
                        <p className="text-xl font-semibold capitalize">{name}</p>
                        <p className="text-xl">{email}</p>
                        <p className="des">{designation}</p>
                        {/* <p className="text-xl">{department}</p> */}
                  </div>
              </div>
          </div>
          </button>
        {/* </Link> */}
      </>
  )
}

export default GridView