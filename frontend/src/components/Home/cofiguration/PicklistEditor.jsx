import React, { useState } from 'react'
import Select from 'react-select'
import useSelectorHook from '../../../../utils/useSelectorHook';
import PicklistData from './PicklistData';
import PicklistPopup from './PicklistPopup';
const PicklistEditor = () => {
  const [selectedOption, setSelectedOption] = useState({value:'department',label:'Department'});
  const {data} = useSelectorHook(selectedOption.value);
  // static dropdown list of the project
  const options = [
    {value:'department',label:'Department'},
    {value:'designation',label:'Designation'},
    {value:'role',label:'Role'},
    {value:'shift',label:'Shift'},
    {value:'reason',label:'Reasons'}
  ];

  // pop-up modal Handler

  const [popup,setPopup] = useState(false);
  console.log('picklist editor');

  return (
    <main>
      {popup && <PicklistPopup selectedOption={selectedOption} popup={popup} setPopup={setPopup}/>}
      <h1 className="font-bold text-xl text-zinc-600">PickList Editor</h1>
      <div className="flex flex-col">
      <div className="flex  justify-start ms-40  mt-10">
          <div className="grid grid-cols-2  justify-center items-center">
              <div className='flex justify-end pr-3'>Select the Picklist : </div>
              <div>
                <Select 
                defaultValue={selectedOption}
                onChange = {setSelectedOption}
                options = {options}
                isSearchable
                placeholder="Select The Picklist"
                className="w-64"
                >
                </Select>
              </div>
          </div>
          
        </div>
        <div className="flex transform mt-10">
            {
              data.length > 0 &&
              <div className="w-2/3 ">
                <div className="flex justify-between  bg-slate-300 pt-2.5 pr-1 pb-2 pl-4">
                  <span className="font-bold text-xl pt-0.5">{selectedOption.label} Values</span>
                  <span className="pr-2"> <button   onClick = {()=>setPopup(!popup)} type="button" className="focus:outline-black text-white text-sm py-1.5 px-4 border-b-4 border-red-600 bg-red-500 hover:bg-red-400">
                Add Values</button></span></div>
                  <ul className="max-h-screen overflow-y-auto">
                    { 
                      data.map((value)=> <PicklistData selectedOption={selectedOption} key={value._id} value={value}></PicklistData>)
                    } 
                  </ul>
              </div>
            }
          </div>
      </div>        
    </main>
  )
}

export default PicklistEditor