import React from 'react'
import useSelectorHook from '../../../../utils/useSelectorHook'
import { deletePoclicyFetch } from '../../../slices/policySlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const PolicyLineItem = ({policy}) => {
  const authenticateUser = useSelectorHook('authenticate');
  const dispatch = useDispatch();

  const deletePolicy = (id) => {
    dispatch(deletePoclicyFetch({id}))
  }

  return (
    <div className="mt-5">
      <div className="w-full sm:w-[80%] p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-md mx-auto">
        <div className="text-3xl font-bold text-gray-800 mb-3">{policy.policyName}</div>
        <div className="text-lg text-gray-600 mb-5">
          <div dangerouslySetInnerHTML={{ __html: policy.description }} />
        </div>
        {authenticateUser.data.role.name.toLowerCase() === 'admin'?
          <div className="mt-10 flex gap-3">
            <button className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 shadow-lg rounded-lg text-sm px-5 py-2.5" onClick={()=> deletePolicy(policy._id)}>
              Delete
            </button>

            <Link className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 shadow-lg rounded-lg text-sm px-5 py-2.5" to={`./addpolicy/${policy._id}`}>Edit</Link>
          </div>:''
        }
      </div>
  </div>
  )
}

export default PolicyLineItem