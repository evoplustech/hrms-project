import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useSelectorHook from '../../../../utils/useSelectorHook';
import { useDispatch } from 'react-redux';
import { addPolicy, updatePolicy } from '../../../slices/policySlice';

const AddPolicy = () => {
  const { data, error, message } = useSelectorHook('policy')
  const [ policyForm, setPolicyForm]  = useState({complianceType:'',description:'',policyName:''});
  const polidyId = useParams() || '';
  const [ policyFromError, setPolicyFormError ]  = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  useEffect(()=>{
    if (polidyId.polidyId) {

      const policy_list = data;
      const policyData = policy_list.find(item => item._id === polidyId.polidyId);
      if (policyData) {
        setPolicyForm({ ...policyData,method: 'update' });
      }

    }else{
      setPolicyForm({complianceType:'',description:'',policyName:'',method:'add'});
    }
  },[polidyId,data]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPolicyForm({
      ...policyForm,
      [name]: value,
    });
  };

  const handleSubmit = ()=>{
    console.log(policyForm)
    if(policyForm.complianceType === '' || policyForm.description === '' || policyForm.policyName === ''){
      setPolicyFormError("All the field must be filled.")
    }
    setPolicyFormError("")
    if (polidyId.polidyId){
      console.log(policyForm);
      dispatch(updatePolicy(policyForm))
    }else{
      dispatch(addPolicy(policyForm))
    }
    navigate('/home/policy')
  }

  

  return (
    <>
      <h1 className='text-3xl'>AddPolicy</h1>
      <div className="max-w-xl mx-auto p-4 bg-gray-300 rounded-md">
      <form onSubmit={(e) => {
      e.preventDefault()}}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="policyName">
            Policy Name:
          </label>
          <input
            type="text"
            id="policyName"
            name="policyName"
            value={policyForm?.policyName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={policyForm?.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="complianceType">
            Compliance Type:
          </label>
          <select id="complianceType"
            name="complianceType"
            value={policyForm?.complianceType}
            onChange={handleChange}
            className="w-full px-4 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" >
              <option value=''>Select</option>
              <option value='HR'  >HR</option>
              <option value='Safety'>Safety</option>
              <option value='Finance'>Finance</option>
              <option value='Other'>Other</option>
          </select>
        </div>
        <div className='m-3'><p className='text-center text-red-500'>{policyFromError}</p></div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </div>


    </>
  )
}

export default AddPolicy