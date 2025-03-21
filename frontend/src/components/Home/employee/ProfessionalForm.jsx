import React, { useState,useRef, useEffect } from 'react'
import {  useLocation, useNavigate, useParams } from 'react-router-dom'
import Input from '../../form/Input';
import Select from '../../form/Select';
import Checkbox from '../../form/Checkbox';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'
import useGetData from '../../../hooks/useGetData.js';
import httpRequest from '../../../../utils/httpRequest';
import toast from 'react-hot-toast';
import Options from './Options'; 
import { fetchAllEmployees } from '../../../slices/employeeSlice.js';
import { useDispatch } from 'react-redux';
import useSelectorHook from '../../../../utils/useSelectorHook.jsx';

const ProfessionalForm = ({params={},path="",method="",buttontext="",className="",navigation=""}) => {

  const location = useLocation();
  const urlpath = location['pathname'].split('/');
  const locationPath = urlpath[urlpath.length-2];
  const rolesList = useSelectorHook('role').data;
  const deptList  = useSelectorHook('department').data;
  const reporting  = useSelectorHook('employee').data;
  console.log('reporting',reporting);
  const reportingList = reporting.filter((value)=>{
    return value['role']?.name.toLowerCase() !=='employee';
  });
  const shiftList  = useSelectorHook('shift').data;
  let {email,employeeId,role:paramRoles,department,designation,dateOfJoining,employmentType,conformation,workLocation,managerId,shift,salary,empPersonalId:{_id}} = params || {};
  dateOfJoining = dateOfJoining?.split('T')[0];
  const {city,office}=workLocation || {};
  const {basic,allowances,hra,total}=salary || {};  
  const designationData = useSelectorHook('designation');
  const desigList =  department ? designationData['data'].filter((value)=> value.department === department._id):[];
console.log(locationPath);
  // Validation Schema Object
  let schema = z.object({
    email : z.string().email(),
    password: locationPath ==='updateEmployee'?z.string().optional() :z.string().min(8,'Password must be at least 8 characters long').regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
    confirmPassword : locationPath ==='updateEmployee'? z.string().optional() :z.string(),
    employeeId : z.string().min(1,'EmployeeId Required'),
    role : z.string().min(1,'role Required'),
    department : z.string().min(1,'department Required'),
    designation : z.string().min(1,'Designation required'),
    dateOfJoining : z.string().min(1,'Required'),
    office : z.string().min(1,' Required'),
    city : z.string().min(1,' Required'),
    managerId : z.string().min(1,' Required'),
    shift : z.string().min(1,'shift required'),
    employmentType : z.string().min(1,'Emplyment type Required'),
    basic  : z.any(),
    hra : z.any(),           
    allowances : z.any(),   
    total : z.any(),
    conformation:z.boolean(),
    empPersonalId : z.string()
  });

  if(locationPath!=='updateEmployee'){
     schema = schema.refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Confirm Password not same as password',
    });
  }
   
  const {register,handleSubmit,formState : {errors},setValue,watch,control } = useForm({
    resolver:zodResolver(schema),
    defaultValues :{
      email,employeeId,dateOfJoining,employmentType,conformation,department:department?._id,city,office,managerId,basic,allowances,hra,total
    }
  })

  useEffect(() => {
    // Check if all lists have been populated and set values
    console.log('where there is sa will there ',deptList?.length,rolesList?.length,desigList?.length,reportingList?.length,shiftList?.length);
    if (
      deptList?.length > 0 &&
      rolesList?.length > 0 &&
      desigList?.length > 0 &&
      reportingList?.length > 0 &&
      shiftList?.length > 0
    ) {
      // Ensure department, designation, role, shift, and managerId are available
      const departmentId = department?._id;
      const designationId = designation?._id;
      const roleId = paramRoles?._id;
      const shiftId = shift?._id;
      const managerIdValue = managerId;
      // Set values only once all conditions are met
      // setValue('department', departmentId);
      setValue('designation', designationId);
      setValue('shift', shiftId);
      setValue('role', roleId);
      setValue('managerId', managerIdValue);
      console.log('this is useEffect',departmentId);
    }
  }, [
    deptList, rolesList, desigList, reportingList, shiftList, // Backend data lists
    setValue, // Avoid infinite loop by depending on setValue
  ]);

const [designationOption,setDesig]= useState([]);
const deptHandle = (e)=>{
  const selectedDept = e.target.value;
  const designation =  designationData['data'].filter((value)=> value.department === selectedDept);
  setValue('designation', designation);
  setValue('department', selectedDept);
  setDesig(designation);
}

const {id} = useParams();
const dispatch = useDispatch();
const navigate = useNavigate();
// form submit handler
const formSubmitHandler = async (data)=>{
  console.log('clicked');
  const result = await httpRequest({path,method,data});
  if(result.success){
    await dispatch(fetchAllEmployees());
    if(navigation){
      await navigate(navigation);
    }else{
      toast.success('Employee Details Updated Successfully');
    }
  }else{
    toast.error('Server Error , Try again Later');
  } 
}
 

  return (
  <>
    <form className="max-w-7xl space-y-16" encType="multipart/form-data" onSubmit = {handleSubmit(formSubmitHandler)}>
      <div className="mb-10">
          <p className="font-semibold text-xl text-gray-700">Employee Professional Details :</p>
      </div>
      <Input type="hidden" value={_id} name="empPersonalId" {...register('empPersonalId')} />
      <div className="grid  md:grid-cols-4">
        <div className="">
          <Input label='Username : '  type="email"  name="email" {...register('email')} />
          {errors?.email && <p className="text-red-600">{errors.email.message}</p>}
        </div>
        <div className="">
          <Input label='Employee Id : ' type="text" name="employeeId" {...register('employeeId')} />
          {errors?.employeeId && <p className="text-red-600">{errors.employeeId.message}</p>}
        </div>
        <div className="">
          <Input label='Password : '  type={`${locationPath ==='updateEmployee'? 'hidden':'text'}`}  name="password" {...register('password')} />
          {errors?.password && <p className="text-red-600 w-5">{errors.password.message}</p>}
        </div>
        <div className="">
          <Input label='Confirm Password : '  type={`${locationPath ==='updateEmployee'? 'hidden':'text'}`}  name="confirmPassword" {...register('confirmPassword')} />
          {errors?.confirmPassword && <p className="text-red-600 w-5">{errors.confirmPassword.message}</p>}
        </div>
        
        
      </div>
      <div className="grid  md:grid-cols-4">
      <div className="">
          <Select label='Role : ' name="role" options={rolesList} {...register('role')}/>
          {errors?.role && <p className="text-red-600">{errors.role.message}</p>}
        </div>
        <div className="">
        <Controller  name="department"  control={control}  render={({ field }) => (
            <Select  label="Department : "  {...field} // register the select with react-hook-form
                  options={deptList}   onChange={(e) => {
                    field.onChange(e); // Call react-hook-form's internal onChange
                    deptHandle(e); // Call your custom handler
                  }}
              />
           )}
        />
      {errors?.department && <p className="text-red-600">{errors.department.message}</p>}
        </div>
        <div className="">
          <Select label='Designation : '  name="designation" options={designationOption.length > 0 ? designationOption:desigList}   {...register('designation')} />
          {errors?.designation && <p className="text-red-600">{errors.designation.message}</p>}
        </div>
        <div className="">
          <Input label='date Of Joining : '  type="date"  name="dateOfJoining"  {...register('dateOfJoining')} />
          {errors?.dateOfJoining && <p className="text-red-600">{errors.dateOfJoining.message}</p>}
        </div>
      </div>
      <div className="grid  md:grid-cols-3">
        <div>
          <Select label='Employment Type :' name="employmentType"  options = {[{name:'Permanent'},{name:'Temporary'}, {name:'Trainee'}]} {...register('employmentType')}  />
          {errors?.employmentType && <p className="text-red-600 w-5">{errors.employmentType.message}</p>}
        </div>
        <div>
         
        </div>
        <div>
          <Controller control = {control}  name="conformation"   render={({field})=>{
            return <Checkbox label='Conformation : '  checked={field.value} {...field}/>
          }} >
          </Controller>
        </div> 
      </div>
      <div className="mb-10">
            <p className="font-semibold text-xl text-gray-700">Work Location :</p>
        </div>
      <div className="grid  md:grid-cols-4">
        <div className="">
          <Input label='Office : '  type="text"  name="office" {...register('office')} />
          {errors?.office && <p className="text-red-600">{errors.office.message}</p>}
        </div>
        <div className="">
          <Input label='city : '  type="text"  name="city" {...register('city')} />
          {errors?.city && <p className="text-red-600">{errors.city.message}</p>}
        </div>
        <div className="">
        <select className="block py-2.5 px-0 w-1/2 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer overflow-auto"  type="text"  name="managerId" {...register('managerId')}>
            <Options label='Reporting Manager : ' options={reportingList} ></Options>
        </select>
        {errors?.managerId && <p className="text-red-600">{errors.managerId.message}</p>}
        </div>
        <div>
         <Select label='Shift' options={shiftList} name='shift' {...register('shift')} />
         {errors?.shift && <p className="text-red-600">{errors.shift.message}</p>}
        </div>
        
      </div>
      
      <div className="mb-10">
          <p className="font-semibold text-xl text-gray-700">Salary Details :</p>
      </div>
      <Input type="hidden" value={id} name="empPersonalId"  {...register('empPersonalId')}/>
      <div className="grid  md:grid-cols-4">
        <div className="">
          <Input label='Basic : ' type="number"  name="basic" {...register('basic')} />
          {errors?.basic && <p className="text-red-600">{errors.basic.message}</p>}
        </div>
        <div className="">
          <Input label='HRA : '  type="number"  name="hra" {...register('hra')} />
          {errors?.hra && <p className="text-red-600">{errors.hra.message}</p>}
        </div>
        <div className="">
          <Input label='Allowances : '  type="number"  name="allowances" {...register('allowances')} />
          {errors?.allowances && <p className="text-red-600">{errors.allowances.message}</p>}
        </div>
        <div className="">
          <Input label='Total : '  type="number"  name="total" {...register('total')} />
          {errors?.total && <p className="text-red-600">{errors.total.message}</p>}
        </div>
      </div>
      {/*  */}
      {/* <div className="grid  md:grid-cols-1">
         
      </div> */}
      <div className="grid  md:grid-cols-1">
          <div className="flex justify-center mt-12">
          <button className={className}>{buttontext}</button>
          </div>
      </div> 
    </form>
  </>
)
}

export default ProfessionalForm