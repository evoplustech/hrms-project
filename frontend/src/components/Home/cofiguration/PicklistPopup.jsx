import { Modal,Box } from '@mui/material'
import React from 'react'
import PicklistForm from './PicklistForm';
import ShiftForm from './ShiftForm';
import timeConversion from '../../../../utils/timeConversion';

const PicklistPopup = ({selectedOption,popup,setPopup,value=""}) => {
  
  let  shiftData = {};
  if(selectedOption.value.toLowerCase()==='shift' ){
    if(value._id){
      const startTime =  timeConversion(value.startTime,12);
      const endTime =  timeConversion(value.endTime,12);

      let days= value.days.length > 0 && value.days.map((values)=>{
        return {['value']:values,'label':values}
      });

      shiftData = {...value,startTime,endTime,days};
    }else{
      shiftData = {_id:'',startTime:'',endTime:'',days:[],name:'',graceTime:''};
    }
    
  }
      
  console.log('picklist popup value-----======>',value,'hello worlsdddddddddddddddd ',selectedOption);

  return (
    <div>
      <Modal open={popup} onClose={()=>setPopup(false)} className="modelBox">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: '65%', // Set desired width
            height: 'auto', // Set desired height,
          }} className="bg-white"
        >
          <h1 className="text-center"></h1>
          {/* <TestComponent/> */}
          {
            selectedOption.value.toLowerCase()==='shift' ? <ShiftForm  setPopup={setPopup} value={shiftData}/> : <PicklistForm selectedOption={selectedOption} setPopup={setPopup} value={value}/>
          }
          </Box>
      </Modal>
    </div>
  )
}

export default PicklistPopup