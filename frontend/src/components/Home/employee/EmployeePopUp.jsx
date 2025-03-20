import React , { useState } from 'react'
import { Modal, Box } from '@mui/material';
import { PiDotsThreeOutlineVerticalDuotone  } from "react-icons/pi";
import { RiDeleteBin2Line, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { BsFillPersonCheckFill } from "react-icons/bs";
import toast from 'react-hot-toast';
import httpRequest from '../../../../utils/httpRequest';
import { useDispatch } from 'react-redux';
import { fetchAllEmployees } from '../../../slices/employeeSlice';
import { TbPasswordFingerprint } from 'react-icons/tb';
import Input from '../../form/Input';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

const EmployeePopUp = ({personId,isActive}) => {

  const schema = z.object({
    password: z.string().min(8,'Password must be at least 8 characters long').regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
    confirmPassword : z.string()
  }).refine((data)=>(data.password===data.confirmPassword),{
    path : ['confirmPassword'],
    message : 'Confirm Password not same as password'
   });

  const {register,handleSubmit,formState:{errors}} = useForm({resolver:zodResolver(schema)});

  const [open, setOpen] = useState(false);
  const [resetpassword,setpassword] = useState(false);
  const [togglehide,setToggleHide] = useState(false);
  const [togglehide1,setToggleHide1] = useState(false);
  const dispatch = useDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const performDeleteAction = async ()=>{
        // delee the employee
        const response = await httpRequest({path:'/api/employee/delete/personal',method:'delete',params:personId});
        if(response.success){
          let msg=response.message;
          await dispatch(fetchAllEmployees());
          if(!isActive)
            msg='Employee Activated Successfully';
          toast.success(msg);
          setOpen(false);
        }else{
            toast.error(response.error);
        }
  }

  const deleteHandler= (param)=>{
    toast(
      (t) => (
        <div>
          <p>{`${param?'Are you sure you want to delete this Employee?':'Activate This Employee ?'}`}</p>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => {
                toast.dismiss(t.id); // Close the toast
                performDeleteAction(); // Perform the action
              }}
            >
              Confirm
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => toast.dismiss(t.id)} // Close the toast
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Keep it open until the user interacts
      }
    );
  }

  const formSubmitHandler = async (formData)=>{
        const response = await httpRequest({path:`/api/employee/credentials/reset`,method:'put',data:formData,params:personId});
        console.log(response);
        if(response.success){
            toast.success('Password Updated Successfully');
            handleClose();
        }
  }

  return (
    <div>
      <button   onClick={handleOpen}><PiDotsThreeOutlineVerticalDuotone className="w-6 h-6 -translate-x-6  translate-y-2 relative flex justify-start" /></button>
      <Modal open={open} onClose={handleClose} className="modelBox">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: '400px', // Set desired width
            height: 'auto', // Set desired height,
          }}
        >
          {
            resetpassword ?   
            <form method="POST" onSubmit = {handleSubmit(formSubmitHandler)}>
              <h2 className="flex justify-center font-semibold text-xl text-gray-600 mb-10">Reset Password</h2>
                <div className="mb-6">
                  <div className="flex justify-center items-center relative ms-10">
                    <Input className="min-w-64" name="password" type={`${togglehide ? 'text':'password'}`} label="Password" {...register('password')}/>
                    <span className="absolute ms-60 pb-3">
                    { 
                      togglehide ? <RiEyeLine className='hover:cursor-pointer w-5 h-5 z-50' onClick = {()=>(setToggleHide(!togglehide))} />:<RiEyeOffLine className='hover:cursor-pointer w-5 h-5 z-50' onClick = {()=>(setToggleHide(!togglehide))} />
                    }
                    </span>
                  </div>
                  {errors?.password && <p className="text-red-600 w-5 pb-4 ms-10 whitespace-nowrap">{errors.password.message}</p>}
                </div>
                <div className="mb-6">
                  <div className="flex justify-center items-center relative ms-10">
                    <Input className="min-w-64" name="confirmPassword" type={`${togglehide1 ? 'text':'password'}`} label="Confirm Password" {...register('confirmPassword')} />
                    
                    <span className="absolute ms-60 pb-3">
                      { 
                        togglehide1 ? <RiEyeLine className='hover:cursor-pointer w-5 h-5 z-50' onClick = {()=>(setToggleHide1(!togglehide1))} />:<RiEyeOffLine className='hover:cursor-pointer w-5 h-5 z-50' onClick = {()=>(setToggleHide1(!togglehide1))} />
                      }
                    </span>
                  </div>
                  {errors?.confirmPassword && <p className="text-red-600 w-5 pb-4 ms-10 whitespace-nowrap">{errors.confirmPassword.message}</p>}
                </div>
                
                <div className="flex justify-center space-x-4">
                <button type="submit" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-semibold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Update</button>
                <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-semibold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={()=>setpassword(false)}>Cancel</button>
                </div>
                

            </form> : 
            <>
              <h2 className="flex justify-center font-semibold text-xl text-gray-600">Employee Configuration</h2>
              <div className="flex justify-around mt-14">
               {
                isActive ? <button className="flex flex-col items-center" onClick={()=>setpassword(true)}>
                <TbPasswordFingerprint className="w-12 h-12 text-green-400" />
                <label className="text-md font-semibold p-2">Reset Password</label>
              </button>:''
               } 
                <button className="flex flex-col items-center" onClick={()=>(deleteHandler(isActive))}>
                  {
                    isActive ? <RiDeleteBin2Line  className="w-12 h-12 text-red-600" /> : <BsFillPersonCheckFill   className="w-12 h-12 text-green-600" />
                  }
                  <label className="text-md font-semibold p-2">{isActive? 'Delete Employee' : 'Retrive Employee'}</label>
                </button>
              </div>
            </>
          }
        </Box>
      </Modal>
    </div>
  )
}

export default EmployeePopUp