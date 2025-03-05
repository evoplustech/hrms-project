import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useSelectorHook from '../../../../utils/useSelectorHook';
import { useDispatch, useSelector } from 'react-redux';
import { addBiometricDevice } from '../../../slices/biometricSlice';
import { getUserRole } from '../../../slices/authSlice';
import Notauthorize from '../Notauthorize';




const AddDevice = () => {
  const { data, error, status } = useSelectorHook('biometric');
  const [formError,setFormError] = useState('')
  let { id } = useParams() || '';
  const dispatch =  useDispatch()
  const navigate = useNavigate();
  const userRole = useSelector(getUserRole)


  // Initialize formData with default values or fetched data based on id
  const [formData, setFormData] = useState({
    deviceName: "",
    ipAddress: "",
    port: "",
    status: "Online",
    connectionType: "Ethernet",
    isActive: true,
    method: 'add'
  });

  useEffect(() => {

    if (id) {
      const biometricData = data.find(item => item._id === id);
      if (biometricData) {
        setFormData({ ...biometricData, method: 'update' });
      }
    }else{
      setFormData({
        deviceName: "",
        ipAddress: "",
        port: "",
        connectionType: "Ethernet",
        status: "Online",
        isActive: true,
        method:'add',
      });
    }
  }, [id, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(formData.deviceName ==='' || formData.port === '' || formData.ipAddress === ''){
      setFormError('*All the field must be filled')
      return false
    }
    
    if(formData.ipAddress.split('.').length !== 4){
      setFormError('*ipAddress is invalid')
      return false
    }

    if((formData.port.toString()).length !== 4){
      setFormError('*port is invalid')
      return false
    }

    if (id) {
      setFormData({...formData,id:id})
    }
    // console.log(formData)
    // return false;
    dispatch(addBiometricDevice(formData))
    // const response = await httpRequest({path:'/api/biometric/addbiometricdevice',method:'post',data:formData})
    // console.log(response);

    navigate('/home/devices')

  };

  if(userRole !== 'admin'){
    return (<>
      <Notauthorize />
    </>)
  }
  
  // Loading check
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error' || error !== null) {
    return <div>Error loading data</div>;
  }
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()}} className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700">
          Device Name
        </label>
        <input
          type="text"
          id="deviceName"
          name="deviceName"
          placeholder="Device Name"
          value={formData.deviceName}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>


      <div className="mb-6">
        <label htmlFor="ipaddress" className="block text-sm font-medium text-gray-700">
          IP Address
        </label>
        <input
          type="text" // IP address should generally be a text field
          id="ipaddress"
          name="ipAddress" // Fixed incorrect name
          value={formData.ipAddress}
          onChange={handleChange}
          placeholder="IP Address"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="port" className="block text-sm font-medium text-gray-700">
          Port
        </label>
        <input
          type="number"
          id="port"
          name="port"
          value={formData.port}
          onChange={handleChange}
          placeholder="Port"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

        <p className='text-red-700 text-center m-2 items-center'>{formError}</p>
      <button
        type="submit"
        className="w-full bg-teal-300 text-white py-2 px-4 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleSubmit}
      >
        {id ? "Update Device" : "Add Device"}

      </button>
    </form>
  );
};

export default AddDevice;
