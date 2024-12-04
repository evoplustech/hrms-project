import React from 'react'

const Radio = ({
  name="",
  className="",
  label,
  ...props


},ref) => {
  return (
    <>
      <div className="flex items-center mb-4">
        <input {...props} ref={ref} id="default-radio-1" type="radio"  name={`${name}`} className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${className}`} />
        {label && <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</label>}
      </div>
    </>
  )
}

export default React.forwardRef(Radio);