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
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="text-xl font-semibold text-gray-800 mb-3">{policy.policyName}</div>
        <div className="text-lg text-gray-600 mb-5">
          <div className="text-base" dangerouslySetInnerHTML={{ __html: policy.description }} />
        </div>
        {authenticateUser.data.role.name.toLowerCase() === 'admin'?
          <div className="mt-10 flex gap-3">
            <button className="text-white hover:bg-green-600 px-6 py-1.5 bg-emerald-500 rounded-lg" onClick={()=> deletePolicy(policy._id)}>
              Delete
            </button>

            <Link className="text-white hover:bg-green-600 px-6 py-1.5 bg-emerald-500 rounded-lg" to={`./addpolicy/${policy._id}`}>Edit</Link>
          </div>:''
        }
      </div>
  </div>
  )
}

export default PolicyLineItem