import React from 'react'

const Checkbox = ({
  label='',
  value='',
  ...props
},ref) => {
  return (
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" {...props} value={`${value}`} className="sr-only peer" />
        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
      </label>
  )
}

export default React.forwardRef(Checkbox);