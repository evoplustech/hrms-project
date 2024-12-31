import React from 'react'

const Options = ({label,options},ref) => {

    const selectOptions = options.map((value)=>{
      return  <option key={value['empPersonalId']._id} value={value['empPersonalId']._id}>{`${value['empPersonalId'].firstName} ${value['empPersonalId'].lastName}`}</option>
    })
  return (
    <>
        <option key='' value=''>{label}</option>
        {selectOptions}
      
    </>
  )
}

export default React.forwardRef(Options)