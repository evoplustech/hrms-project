import React, { useState } from 'react'
import Input from '../../form/Input'
import Radio from '../../form/Radio';
import Select from '../../form/Select';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { IoCloseCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import httpRequest from '../../../../utils/httpRequest';
import toast from 'react-hot-toast';


const PersonalForm = ({params={},path="",method="",button="",className="",navigation=""}) => {
  
  const navigate = useNavigate();
  let {firstName,lastName,dateOfBirth,gender,contactInfo,nationality,maritalStatus,emergencyContact,idProofs} = params || {};
   dateOfBirth = dateOfBirth?.split('T')[0];
  // ,address:{street,city,state,zipCode,country}
  const {phone,email,address} = contactInfo || {};
  const {street,city,state,zipCode,country} = address || {};
  // console.log(street,city,state,zipCode,country);
  const {name,relationship,phone:emergency_phone} = emergencyContact||{};
  // console.log(emergency_phone);
  const {aadharCard,passportNumber,panCard} = idProofs || {};
  console.log('ssss',dateOfBirth,Date.parse(dateOfBirth));

  const schema = z.object({
    firstName : z.string().min(1,'First Name Is Required'),
    lastName : z.string().min(1,'Last Name Is Required'),
    dateOfBirth : z.string().refine((val)=>(!isNaN(Date.parse(val))),{
      message : 'Dob is required'
    }),
    gender : z.enum(['Male', 'Female', 'Other'],{
      errorMap : ()=>({message:'Select gender'})
    }),
    phone : z.string().min(10,'Phone no should be 10 digit').max(12,'Phone no Should not exceed 12 digit'),
    email : z.string().email({message:'Invalid email address'}),
    maritalStatus : z.enum(['Single', 'Married', 'Divorced', 'Widowed'],{
      errorMap : ()=>({message:'Select marital status'})
    }),
    name : z.string().min(1,'Name Cannot be Empty'),
    relationship:z.string().min(1,'relation Need To Specify'),
    emergency_phone : z.string().min(10,'Phone no should be 10 digit').max(12,'Phone no Should not exceed 12 digit'),
    nationality : z.string().min(1,'nationality is required'),
    aadharCard:z.string().min(1,'aadharCard Is Required'),
    passportNumber : z.string().min(1,'passport No Is Required'),
    panCard : z.string().min(1,'panCard No Is Required'),
    street : z.string().min(1,'street Is Required'),
    city: z.string().min(1,'city Is Required'),
    state: z.string().min(1,'state Is Required'),
    zipCode: z.string().min(1,'pincode Is Required'),
    country: z.string().min(1,'country Is Required'),
   
  

  })

 const {register,handleSubmit,formState : {errors}} = useForm({
   resolver : zodResolver(schema),
   defaultValues: {
    firstName,lastName,dateOfBirth,gender,maritalStatus,phone,email,name,relationship,emergency_phone,nationality,street,city,state,zipCode,country,aadharCard,passportNumber,panCard
   }
 });
  
  const formSubmitHandler = async (param)=>{
   
    const {street,city,state,zipCode,country,name,relationship,emergency_phone,aadharCard,passportNumber,panCard,phone,email} = param;
    const contactInfo = {phone,email};
    const emergencyContact =  {name,relationship,phone : emergency_phone};
    const idProofs = {aadharCard,passportNumber,panCard};
    const address = {street,city,state,zipCode,country};
    contactInfo.address=address;

    const formData = {
      ...param,
      emergencyContact,
      idProofs,
      address,
      contactInfo
    }
    try{
        const response = await httpRequest({path,method,data:formData});
        if(response.success){
            const {_id} = await response.data;
            console.log(response.data);
            console.log(navigation,_id);
            if(navigation){
              navigate(`${navigation}/${_id}`);
            }
            toast.success('Employee Details Updated Successfully');
        }else{
            throw new Error(response.message);
        }
        
    }catch(error){
      console.error(`Error : ${error.message}`);
      toast.error(`Error Updation Failed`);
    }
}


  const [file,setFile] = useState(null);
  const fileHandle = (e)=>{
      setFile(e.target.files[0]);
      console.log(e.target.files);
  }

  const removeFile = ()=>{
    setFile(null);
  }
 console.log(errors.maritalStatus)

 const options = [{name:'Single'},{name:'Married'}, {name:'Divorced'}, {name:'Widowed'}];

  return (
   <>
    <div className="">
      <form className="max-w-7xl" encType="multipart/form-data" onSubmit = {handleSubmit(formSubmitHandler)}>
        <div className="mb-10">
            <p className="font-semibold text-xl">Employee Personal Details :</p>
        </div>
        <div className="grid  md:grid-cols-3">
          <div className="">
            <Input label='First Name : '  type="text" {...register('firstName')} />
            {errors?.firstName && <p className="text-red-600">{errors.firstName.message}</p>}
          </div>
          <div className="">
            <Input label='Last Name : ' name="lastName" type="text" {...register('lastName')} />
            {errors?.lastName && <p className="text-red-600">{errors.lastName.message}</p>}
          </div>
           <div className="">
            <Input label='Date Of Birth : ' name="dateOfBirth" type="date" {...register('dateOfBirth')} />
            {errors?.dateOfBirth && <p className="text-red-600">{errors.dateOfBirth.message}</p>}
          </div>
        </div>
        <div className="grid  md:grid-cols-3 mt-12">
          <div>
           <Input label='Phone No : ' name="phone" type="text" {...register('phone')} />
           {errors?.phone && <p className="text-red-600">{errors.phone.message}</p>}
          </div>
          <div>
           <Input label='Personal Email : ' name="email" type="email" {...register('email')}  />
           {errors?.email && <p className="text-red-600">{errors.email.message}</p>}
          </div>
          <div className="flex space-x-6"> 
           <p className="text-gray-500 transform translate-y-2">Gender : </p>
           
            <Radio label="Male" value="Male" name="gender" {...register('gender')} />
            <Radio label="Female" value="Female" name="gender" {...register('gender')} />
            <Radio label="Other" value="Other" name="gender" {...register('gender')} />
         
            {errors?.gender && <p className= "absolute text-red-600 transform translate-y-14">{errors.gender.message}</p>}
          </div>
        </div>
        <div className="mt-12">
        <p className="font-semibold">Residential Address :</p>
        </div>
        
          <div className="grid  md:grid-cols-3 mt-12">
            <div>
              <Input label='Street : ' name="street" type="text" className="w-1/2" {...register('street')} />
              {errors?.street && <p className="text-red-600">{errors.street.message}</p>}
            </div>
            <div>
              <Input label='City : ' name="city" type="text" {...register('city')} />
              {errors?.city && <p className="text-red-600">{errors.city.message}</p>}
            </div>
            <div>
              <Input label='state : ' name="state" type="text" {...register('state')} />
              {errors?.state && <p className="text-red-600">{errors.state.message}</p>}
            </div>
          </div>
        
        <div className="grid  md:grid-cols-2 mt-12">
          
          
        </div>
        <div className="grid  md:grid-cols-4 mt-12">
          <div>
           <Input label='PinCode : ' name="zipCode" type="text" {...register('zipCode')}  />
           {errors?.zipCode && <p className="text-red-600">{errors.zipCode.message}</p>}
          </div>
          <div>
           <Input label='Country : ' name="country" type="text" {...register('country')} />
           {errors?.country && <p className="text-red-600">{errors.country.message}</p>}
          </div>
          <div>
            <Select label = 'Marital Status :' options={options} name='maritalStatus' {...register('maritalStatus')} />
            {errors?.maritalStatus && <p className="text-red-600">{errors.maritalStatus.message}</p>}
          </div>
          <div>
            <Input label='Nationality : ' name="nationality" type="text" {...register('nationality')} />
            {errors?.nationality && <p className="text-red-600">{errors.nationality.message}</p>}
          </div>
        </div>
        <div className="grid  md:grid-cols-2 mt-12">
            
        </div>
        <div className="mt-12">
          <p className="font-semibold">Emergency Contact Details :</p>
        </div>
        <div className="grid  md:grid-cols-3 mt-12">
          <div>
           <Input label='Name : ' name="name" type="text" {...register('name')} />
           {errors?.name && <p className="text-red-600">{errors.name.message}</p>}
          </div>
          <div>
           <Input label='relation : ' name="relationship" type="text" {...register('relationship')} />
           {errors?.relationship && <p className="text-red-600">{errors.relationship.message}</p>}
          </div>
          <div>
           <Input label='phone : ' name="emergency_phone" type="text" {...register('emergency_phone')} />
           {errors?.emergency_phone && <p className="text-red-600">{errors.emergency_phone.message}</p>}
          </div>
        </div>
        <div className="mt-12">
          <p className="font-semibold">Id Proofs :</p>
        </div>
        <div className="grid  md:grid-cols-3 mt-12">
          <div>
            <Input label='Aadhar Card No : ' name="aadharCard" type="text" {...register('aadharCard')}  />
            {errors?.aadharCard && <p className="text-red-600">{errors.aadharCard.message}</p>}
          </div>
          <div>
            <Input label='Passport No  : ' name="passportNumber" type="text" {...register('passportNumber')}  />
            {errors?.passportNumber && <p className="text-red-600">{errors.passportNumber.message}</p>}
          </div>
          <div> 
           <Input label='Pan Card No : ' name="panCard" type="text" {...register('panCard')} />
           {errors?.panCard && <p className="text-red-600">{errors.panCard.message}</p>}
          </div>
        </div>
        <div className="grid  md:grid-cols-1 mt-12">
          <div><label>Employee Profile Pic :</label></div>
            <div className="flex items-start justify-start pt-10">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-1/3 h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                { file && <div><p className="text-gray-600">{`Uploaded File - ${file.name}`}</p></div> || <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                       
                    </div>}
                    <input id="dropzone-file" name="profilepic" type="file" className="hidden"  {...register('profilepic')} onChange = {fileHandle}/>
                </label>
                {file && <span className="absolute transform translate-x-96" title="Remove File" ><IoCloseCircle onClick={removeFile} className="w-7 h-7 cursor-pointer" /></span>}
            </div> 
        </div>
        <div className="grid  md:grid-cols-1 mt-20 ">
            <div className="flex justify-center mt-20">
              <button className={className}> {button}</button>
            </div>
        </div>   
    </form>
    </div>
   </>
  )
}

export default PersonalForm