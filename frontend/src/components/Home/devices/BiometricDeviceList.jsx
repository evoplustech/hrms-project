import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useSelectorHook from '../../../../utils/useSelectorHook';
import httpRequest from '../../../../utils/httpRequest';
import { fetchBiometricDevice, deleteBiometericDevice } from '../../../slices/biometricSlice';

const BiometricDeviceList = () => {
    const dispatch = useDispatch();
    const { data, error, status } = useSelectorHook('biometric');

    // useEffect(()=>{
    //   dispatch(fetchBiometricDevice());
    // },[dispatch])

    const deleteDevice = async (name,id) => {

        const device_detail= {
            isActive: false,
            method: 'delete',
            _id: id
        }
        if(confirm(`Are you sure you want to delete this Device ${name}`)){
            const response = await httpRequest({path:'/api/biometric/addbiometricdevice', method:'post', data:device_detail});
            dispatch(deleteBiometericDevice({id}))
            alert(response.message)
            
            
        }
    }

    return (
        <>
          <div className="text-lg font-bold">
            <h1>Biometric Device List</h1>
          </div>
      
      
          {/* Error Message */}
          {error && <div className="text-red-500 w-full text-center p-2">{error}</div>}
      
          {/* Success and Data Rendering */}
          {status === 'success' ? (
            data.length > 0 ? (
              <div className="flex flex-row flex-wrap">
                {data.map((biometric, key) => (
                  <div key={key} className="m-2 bg-white rounded-lg border-gray-700 border-2 px-2 py-4 w-1/4">
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
                        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        onClick={() => deleteDevice(biometric.deviceName, biometric._id)}
                        aria-label="Delete device"
                      >
                        Delete
                      </button>
                      <a className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" href={`./devices/adddevice/${biometric._id}`}>Edit</a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full text-center bg-gray-100 p-10 font-semibold">No Record Found</div>
            )
          ) : 
            (status !== 'success' && status !== 'error') && (
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