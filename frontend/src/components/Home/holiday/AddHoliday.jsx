import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSelectorHook from '../../../../utils/useSelectorHook';
import { useDispatch, useSelector } from 'react-redux';
import { addHoliday, holidaySheetUpload } from '../../../slices/holidaySlice';
import Excel from 'exceljs';
import toast from 'react-hot-toast';
import { IoMdCloudUpload } from "react-icons/io";
import { RiAddCircleLine } from "react-icons/ri";
import Notauthorize from '../Notauthorize';
import { getUserRole } from '../../../slices/authSlice';


const AddHoliday = () => {
  // console. clear()
  const { data } = useSelectorHook('holiday');
  const userRole = useSelector(getUserRole);
  const shift = useSelectorHook("shift");
  const {id} = useParams();
  const [holidayForm,setHolidayForm] = useState({_id:"", holidayDate:"", holidayName: "", description:"",  recurring:false, holidayType:"", method: "", leavefor:""});
  const addHolidayBtn = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sheetUploadFlag,setSheetUpload] = useState(false);

  useEffect(()=>{

    if(id){
      const updatingHoliday = data.find(holiday=> holiday._id === id)
      setHolidayForm({...updatingHoliday, method: "update" })
    }else{
      if(addHolidayBtn.current !== undefined){
        addHolidayBtn.current.disabled = false;
        addHolidayBtn.current.classList.replace("bg-green-800","bg-green-500");
        addHolidayBtn.current.style.cursor = "pointer";
      }
      // setHolidayForm({...holidayForm, method: "add"});
      setHolidayForm({ _id:"", holidayDate:"", holidayName: "", description:"", recurring:false, holidayType:"", method: "add", leavefor:"" })
    }
  },[id])

  const handlechange = (e) => {
    const { name, value } = e.target;
    setHolidayForm({...holidayForm, [name]:value});
  }

  const handleAddHoliday = async (e) => {
    if(addHolidayBtn.current !== undefined){
      addHolidayBtn.current.disabled = true;
      addHolidayBtn.current.classList.replace("bg-green-500","bg-green-800");
      addHolidayBtn.current.style.cursor = "no-drop";
    }

    if(holidayForm.holidayDate === "" || holidayForm.description === "" || holidayForm.holidayName === "" || holidayForm.holidayType === "" || holidayForm.recurring === ""){
      toast.error('All the Fields must be filled', {duration:5000} )
      if(addHolidayBtn.current !== undefined){
        addHolidayBtn.current.disabled = false;
        addHolidayBtn.current.classList.replace("bg-green-800","bg-green-500");
        addHolidayBtn.current.style.cursor = "pointer";
      }
      return false;

    }

    const res = await dispatch(addHoliday(holidayForm)).unwrap();

    if(res.success){
      navigate('/home/holiday')
    }else{
      if(addHolidayBtn.current !== undefined){
        addHolidayBtn.current.disabled = false;
        addHolidayBtn.current.classList.replace("bg-green-800","bg-green-500");
        addHolidayBtn.current.style.cursor = "pointer";
      }
    }

  }

  let sheetData = [];
  const handleChange = (e) => {
    const file = e.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const wb = new Excel.Workbook();
    const reader = new FileReader();
    const header = ["holidayDate", "holidayName", "holidayType", "description", "Recurring","leavefor"];

    if(!['xlsx','xls'].includes(fileExtension)){
      alert("File type must be xlsx OR xls");
      e.target.value = null;
      return false;
    }
    reader.readAsArrayBuffer(file);

    reader.onload = async () => {
        const buffer = reader.result;
        try {
            await wb.xlsx.load(buffer);
            wb.eachSheet((sheet) => {
                sheet.eachRow((row, rowIndex) => {

                  if(rowIndex>1){
                    const datevalue = row.values[1]
                    // const YY = datevalue.getFullYear();
                    // const MM = datevalue.getMonth()+1;
                    // const DD = datevalue.getDate();
                    // console.log(YY,MM,DD)
                    // console.log(DD.length)
                    // const date =`${YY}-${MM}-${DD}`;
                    const date = new Date(datevalue).toISOString().split("T")[0]
                    
                    console.log(date)
                      let data_row = {
                          [header[0]]: date,
                          [header[1]]: row.values[2],
                          [header[2]]: row.values[3],
                          [header[3]]: row.values[4],
                          [header[4]]: row.values[5],
                          [header[5]]: row.values[6],
                      };
                      sheetData.push(data_row);
                    }
                });
            });

        } catch (error) {
            console.error("Error loading the workbook:", error);
        }
    };
  };

  const submitHolidaySheet =async () => {

    if(!sheetData.length){
      alert("Holiday Sheet need to upload.");
      return false;
    }
    console.log(sheetData)
    // return false;
    const res = await dispatch(holidaySheetUpload({data:sheetData})).unwrap();
    if(res.success){
      if(res.data !== undefined){
        navigate('/home/holiday')
      }
    }
  }

  if(userRole.toLowerCase() !== 'admin'){
    return (<>
      <Notauthorize />
    </>)
  }

  return (<>
    <div>
      <div>
        <button data-modal-target="static-modal" data-modal-toggle="static-modal" className="block text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center dark:bg-green-500 dark:hover:bg-green-800 dark:focus:ring-green-800" type="button" onClick={ (e) => { setSheetUpload(!sheetUploadFlag) } }>
        {sheetUploadFlag?(<span className='flex flex-1 align-baseline'><RiAddCircleLine size={22} /> Add a Holiday</span>):(<span className='flex flex-1 align-baseline'> <IoMdCloudUpload size={22} className='mr-2' />  Upload Holiday Sheet</span>)}
        </button>
        
      </div>
      
      
      
      {sheetUploadFlag?
        <div className="w-[90%] sm:w-[60%] md:w-[50%] mt-10 px-6 mx-auto py-12 text-center align-middle border border-gray-300 rounded-3xl flex flex-col bg-white shadow-lg">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold mb-8 text-gray-800 underline">Upload Holiday Sheet</h1>
          </div>
          <div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col items-center">
                <a
                  href="../../../src/assets/samplesheet/holidaysamplesheet.xlsx"
                  className="text-blue-600 hover:text-blue-800 mb-4 text-lg"
                >
                  (Sample Sheet)
                </a>
                <input
                  type="file"
                  className="border-2 border-gray-300 px-3 py-5 rounded-lg w-full mb-6 text-center"
                  onChange={handleChange}
                />
                <div className="mt-6">
                  <button className="bg-green-600 hover:bg-green-400 py-2 px-6 text-white font-semibold border rounded-2xl transition-all duration-300" onClick={submitHolidaySheet}>
                    Upload
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        :(<><div className='text-3xl text-center'>
        <h1 className='font-bold underline underline-offset-auto'>Add Holiday</h1>
      </div>
      <form className='w-[75%] mx-auto mt-5 p-6 border border-gray-300 rounded-lg shadow-md' onSubmit={(e)=> e.preventDefault()}>
        <div className='grid grid-cols-2 gaps-col'> 
          <div className='my-4'>
            <label htmlFor='holidayName' className='block text-lg font-semibold text-gray-700'>
              Holiday Name
            </label>
            <input
              type='text'
              name='holidayName'
              id='holidayName'
              value={holidayForm.holidayName}
              onChange={handlechange}
              className='border w-96 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter holiday name'
            />
          </div>

          <div className='my-4'>
            <label htmlFor='holidayDate' className='block text-lg font-semibold text-gray-700'>
              Holiday Date
            </label>
            <input
              type='date'
              name='holidayDate'
              id='holidayDate'
              value={holidayForm.holidayDate}
              onChange={handlechange}
              className=' border w-96 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='my-4'>
            <label htmlFor='description' className='block text-lg font-semibold text-gray-700'>
              Holiday Type
            </label>
            <select
              name='holidayType'
              id='holidayType'
              value={holidayForm.holidayType}
              onChange={handlechange}
              className='border w-96 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
            >
              <option value="">Select</option>
              <option value="Public">Public</option>
              <option value="Company">Company</option>
              <option value="Custom">Custom</option>
              <option value="Optional">Optional</option>
            </select>
          </div>

          <div className='my-4'>
            <label htmlFor='Repeated Leave' className='block text-lg font-semibold text-gray-700'>
              Repeated Leave
            </label>
            <select name='recurring'
              id='recurring'
              value={holidayForm.recurring}
              onChange={handlechange}
              className='border w-96 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'>
                <option value="">Select</option>
                <option value={true}>True</option>
                <option value={false}>False</option>
              </select>
          </div>
        </div>

        {/* Leave For - Start */}
        <div className='my-4'>
            <label htmlFor='description' className='block text-lg font-semibold text-gray-700'>
              Leave For
            </label>
            <select
              name = 'leavefor'
              id = 'leavefor'
              value = {holidayForm.leavefor}
              onChange = {handlechange}
              className = 'border w-96 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
            >
              <option value="">Select</option>
              {shift.data.map( (shift,index) =>{
                return (<option key={index} value={shift.name} > {shift.name}</option>)
              })}

            </select>
          </div>
          {/* Leave For end */}

        <div className='my-4'>
          <label htmlFor='holidayDescription' className='block text-lg font-semibold text-gray-700'>
            Holiday Description
          </label>
          <textarea
            name='description'
            id='description'
            value={holidayForm.description}
            onChange={handlechange}
            className='border w-full  min-h-40 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
            rows='4'
            placeholder='Enter description of the holiday'
          />
        </div>

        <div className='text-center'>
          <button
            ref = {addHolidayBtn}
            type='Add Holiday'
            className='mt-4 w-40  bg-green-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'
            onClick={handleAddHoliday}
          >
            Submit
          </button>
        </div>
      </form></>)}
    </div>
  </>)
}

export default AddHoliday