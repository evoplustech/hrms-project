import React from 'react'
import { FaFilter } from "react-icons/fa6";

const SearchBox = () => {
  return (
    <div className="flex justify-end space-x-8">
        {/* <div className="relative w-60">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <FaFilter />
            </div>
            <input type="text" id="voice-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Employee" required />
        </div> */}
        <div>
        <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-md px-10 py-2.5 text-center me-2 mb-2">In-Complete Profile</button>
        </div>
    </div>
  )
}

export default SearchBox