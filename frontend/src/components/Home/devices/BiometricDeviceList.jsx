import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useSelectorHook from '../../../../utils/useSelectorHook';
import httpRequest from '../../../../utils/httpRequest';
import { deleteBiometericDevice } from '../../../slices/biometricSlice';
import Notauthorize from '../Notauthorize.jsx';
import toast from 'react-hot-toast';
import { getUserRole } from '../../../slices/authSlice';

const BiometricDeviceList = () => {
    const dispatch = useDispatch();
    const { data, error, status } = useSelectorHook('biometric');
    // const authenticate =  useSelectorHook('authenticateuser')
    // const userRole = authenticate.data.role.name.toLowerCase();
    const userRole = useSelector(getUserRole);


    const deleteDevice = async (name,id) => {

        const device_detail= {
          isActive: false,
          method: 'delete',
          _id: id
        }
        if(confirm(`Are you sure you want to delete this Device ${name}`)){
            const response = await httpRequest({path:'/api/biometric/addbiometricdevice', method:'post', data:device_detail});
            dispatch(deleteBiometericDevice({id}))
            toast.success(response.message)
        }
    }


    if(userRole.toLowerCase() !== 'admin'){
      return (<>
        <Notauthorize />
      </>)
    }
    return (
        <>
          {/* <div className="text-lg font-bold">
            <h1>Biometric Device List</h1>
          </div> */}

          {error && <div className="text-red-500 w-full text-center p-2">{error}</div>}

          {status === 'success' ? (
            data.length > 0 ? (
              <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
                {data.map((biometric, key) => (
                  <div key={key} className="">
                    <div className="mb-4 flex flex-row">
                      <label className="font-semibold text-700 w-1/2 text-left">Biometric Device Name:</label>
                      <div className="text-900 ml-4 w-1/2 align-middle">{biometric.deviceName}</div>
                    </div>
                    <div className="mb-4 flex flex-row">
                      <label className="font-semibold text-900 w-1/2 text-left">Device IP Address:</label>
                      <div className="ml-4 w-1/2 text-left">{biometric.ipAddress}</div>
                    </div>
                    <div className="mb-4 flex flex-row">
                      <label className="font-semibold w-1/2 text-left">Port:</label>
                      <div className="ml-4 w-1/2 text-left">{biometric.port}</div>
                    </div>
                    <div className="flex justify-center mt-6">
                      <button
                        className="text-white hover:bg-green-600 px-6 py-1.5 bg-emerald-500 m-5 rounded-lg"
                        onClick={() => deleteDevice(biometric.deviceName, biometric._id)}
                        aria-label="Delete device"
                      >
                        Delete
                      </button>
                      <a className="text-white hover:bg-green-600 px-6 py-1.5 bg-emerald-500 m-5 rounded-lg" href={`./devices/adddevice/${biometric._id}`}>Edit</a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full text-center bg-gray-100 p-10 font-semibold">No Record Found</div>
            )
          ) : 
            (status !== 'success' && status !== 'error' && status !== 'rejected') && (
                <div className="w-full justify-center relative h-svh">
                  <div className="p-6 rounded-lg">
                    <p className="absolute inset-0 flex items-center justify-center text-2xl text-white font-bold bg-opacity-50 bg-black">
                      Loading...
                    </p>
                  </div>
                </div>
              )
          }
        </>
      );
      
}

export default BiometricDeviceList