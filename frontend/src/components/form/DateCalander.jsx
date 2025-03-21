import React, { useState } from 'react'
import DatePicker from "react-datepicker";
const DateCalander = ({
label,
...props
},ref) => {
  

  return (
    <>
      <div className="flex">
          <label className="mr-2">{label} :</label>
            <DatePicker
              ref={ref}
              timeFormat="HH:mm"
              dateFormat="dd/MM/yyyy HH:mm" // Format for the selected date and time
              {...props}
            />
      </div>
    </>
  )
}

export default React.forwardRef(DateCalander);