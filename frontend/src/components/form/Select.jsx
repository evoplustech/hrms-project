import React,{useId} from 'react'

const Select = ({
  label='',
  name='',
  options=[],
  className='',
  ...props
},ref) => {

  const id = useId();
console.log(options);
  return (
    <div>
      {
        label && <label htmlFor={id} className="sr-only">{label}</label> 
      }
      <select name={name} ref={ref} id={id} className="block py-2.5 px-0 w-1/2 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer overflow-auto" {...props}>
        <option value="">{label}</option>
          {
              options?.map((option)=>{
              return <option key={option.name} value={option._id}>{option.name}</option>
            })
          }
      </select>
    </div>
  )
}

export default React.forwardRef(Select);





