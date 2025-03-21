import React, { useState } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCog } from 'react-icons/fa';

const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState('general');

  const user = {
    name: 'Jane Doe',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Passionate designer and tech enthusiast. Love creating beautiful user experiences.',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
    <div className=" flex transform -translate-y-6 bg-opacity-50 mt-0 overflow-y-auto h-screen w-full  items-center bg-red-400 ">
        <div className="flex justify-between transform -translate-y-56 space-x-24">
          <div className="w-2/3 mx-auto ms-20 flex justify-center items-center space-x-20 bg-blue-400 ">
          <div className="md:w-1/3 text-center md:pr-8 md:py-8  ">
            <div className="w-48 h-48 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400 mx-auto">
              <img
                src={user.image}
                alt="Profile picture of Jane Doe"
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <div className="flex flex-col items-center text-center justify-center mt-4">
              <h2 className="font-medium title-font text-2xl text-pink-500">{user.name}</h2>
              <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
              
            </div>
          </div>
          <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Contact Information</h3>
              <div className="flex items-center mb-2">
                <FaEnvelope className="text-indigo-500 mr-2" />
                <a href={`mailto:${user.email}`} className="text-gray-600 hover:text-indigo-500 transition-colors duration-300">{user.email}</a>
              </div>
              <div className="flex items-center mb-2">
                <FaPhone className="text-indigo-500 mr-2" />
                <a href={`tel:${user.phone}`} className="text-gray-600 hover:text-indigo-500 transition-colors duration-300">{user.phone}</a>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-indigo-500 mr-2" />
                <span className="text-gray-600">{user.address}</span>
              </div>
          </div>
          </div>
          
          <div className=" flex transform translate-x-2 md:pl-8 ms-96 mt-16  pe-20">
            <div className=" h-full p-0 shadow-md shadow-slate-700 bg-gray-400  mt-14 ms-0 me-2  rounded ">

            </div>
            
            <div className={`shadow-slate-500 shadow shadow-[0_0_0_10px_rgba(0,0,0,0.2)`}>
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => handleTabChange('general')}
                    className={`${
                      activeTab === 'general'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-300`}
                  >
                    Personal Details
                  </button>
                  <button
                    onClick={() => handleTabChange('privacy')}
                    className={`${
                      activeTab === 'privacy'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-300`}
                  >
                    Professional Details
                  </button>
                  
                </nav>
              </div>
              <div className="mt-4">
                {activeTab === 'general' && (
                  <div className="animate-fade-in">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">General Settings</h4>
                    <p className="text-gray-600">Manage your account settings and preferences here.</p>
                  </div>
                )}
                {activeTab === 'privacy' && (
                  <div className="animate-fade-in">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Privacy Settings</h4>
                    <p className="text-gray-600">Control your privacy and security preferences.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className=" absolute  shadow-md shadow-slate-700 w-2/3 h-1 bg-gray-400 rounded mt-2 mb-4">
        
                  
                  
        </div>     
    </div>
    
       
    </>
    )
}

export default EmployeeProfile