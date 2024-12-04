import React from 'react'
import { useParams } from 'react-router-dom'
import Input from '../../form/Input';
import Select from '../../form/Select';
import Checkbox from '../../form/Checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'

const ProfessionalDetailsForm = () => {

    const schema = z.object({
      email : z.string().email(),
      password : z.string().min(8,'Password must be at least 8 characters long').regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
      confirmPassword : z.string(),
      employeeId : z.string().min(1,'EmployeeId Required'),
      role : z.string().min(1,'role Required'),
      department : z.string().min(1,'department Required'),
      designation : z.string().min(1,'Designation required'),
      dateOfJoining : z.string().min(1,'Required'),
      office : z.string().min(1,' Required'),
      city : z.string().min(1,' Required'),
      managerId : z.string().min(1,' Required'),
      shift : z.string().min(1,'shift required'),
      employmentType : z.string().min(1,'Emplyment type Required')

    }).refine((data)=>(data.password===data.confirmPassword),{
      path : ['confirmPassword'],
      message : 'Confirm Password not same as password'
     })

    const {register,handleSubmit,formState : {errors}} = useForm({
      resolver:zodResolver(schema)
    })

  const {id} = useParams();

  const formSubmitHandler = async (data)=>{

        console.log(data);

  }


  const role = ['Admin', 'Employee', 'Hr','Manager','Tl'];
  const department = ['Marketing Dept','IT dept','Hr Dept','Sales Dept'];
  const designation = ['Marketing Dept','IT dept','Hr Dept','Sales Dept'];
  const emplomentType= ['Full-Time', 'Part-Time', 'Contract'];

  return (
    <>
      <form className="max-w-7xl space-y-16" encType="multipart/form-data" onSubmit = {handleSubmit(formSubmitHandler)}>
        <div className="mb-10">
            <p className="font-semibold text-xl text-gray-700">Employee Professional Details :</p>
        </div>
        <Input type="hidden" value={id} name="empPersonalId" {...register('empPersonalId')} />
        <div className="grid  md:grid-cols-4">
          <div className="">
            <Input label='Username : '  type="email"  name="email" {...register('email')} />
            {errors?.email && <p className="text-red-600">{errors.email.message}</p>}
          </div>
          <div className="">
            <Input label='Password : '  type="password"  name="password" {...register('password')} />
            {errors?.password && <p className="text-red-600 w-5">{errors.password.message}</p>}
          </div>
          <div className="">
            <Input label='Confirm Password : '  type="confirmPassword"  name="confirmPassword" {...register('confirmPassword')} />
            {errors?.confirmPassword && <p className="text-red-600 w-5">{errors.confirmPassword.message}</p>}
          </div>
          <div className="">
            <Input label='Employee Id : ' type="text" name="employeeId" {...register('employeeId')} />
            {errors?.employeeId && <p className="text-red-600">{errors.employeeId.message}</p>}
          </div>
          
        </div>
        <div className="grid  md:grid-cols-4">
        <div className="">
            <Select label='Role : ' name="role" options={role} {...register('role')}/>
            {errors?.role && <p className="text-red-600">{errors.role.message}</p>}
          </div>
          <div className="">
            <Select label='Department : '  name="department" options={department} {...register('department')} />
            {errors?.department && <p className="text-red-600">{errors.department.message}</p>}
          </div>
          <div className="">
            <Select label='Designation : '  name="designation"  options={designation} {...register('designation')} />
            {errors?.designation && <p className="text-red-600">{errors.designation.message}</p>}
          </div>
          <div className="">
            <Input label='date Of Joining : '  type="date"  name="dateOfJoining"  {...register('dateOfJoining')} />
            {errors?.dateOfJoining && <p className="text-red-600">{errors.dateOfJoining.message}</p>}
          </div>
        </div>
        <div className="grid  md:grid-cols-3">
          <div>
            <Select label='Employment Type :' name="employmentType"  {...register('employmentType')} options={emplomentType} />
            {errors?.employmentType && <p className="text-red-600 w-5">{errors.employmentType.message}</p>}
          </div>
          <div>
            <Select label='Skills :' name="skills"  {...register('skills')} options={['coding','analyst','Marketing']} />
          </div>
          <div>
             <Checkbox label='Conformation'  name='conformation' {...register('conformation')} />
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
          <Input label='Reporting Manager : ' type="text"  name="managerId" {...register('managerId')} />
          {errors?.managerId && <p className="text-red-600">{errors.managerId.message}</p>}
          </div>
          <div>
           <Select label='Shift' name='shift' {...register('shift')} />
           {errors?.shift && <p className="text-red-600">{errors.shift.message}</p>}
          </div>
          
        </div>
        <div className="mb-10">
              <p className="font-semibold text-xl text-gray-700">Previous Work Experience :</p>
          </div>
        <div className="grid  md:grid-cols-4">
          <div className="">
            <Input label='Company : '  type="text"  name="company" {...register('company')} />
          </div>
          <div className="">
            <Input label='Position : '  type="text"  name="position" {...register('position')} />
          </div>
          <div className="">
            <Input label='From Date : '  type="date"  name="fromDate" {...register('fromDate')} />
          </div>
          <div className="">
            <Input label='To Date : '  type="date"  name="toDate" {...register('toDate')} />
          </div>  
        </div>
        {/*  */}
        <div className="mb-10">
            <p className="font-semibold text-xl text-gray-700">Salary Details :</p>
        </div>
        <Input type="hidden" value={id} name="empPersonalId" />
        <div className="grid  md:grid-cols-4">
          <div className="">
            <Input label='Basic : '  type="number"  name="basic" {...register('basic')} />
          </div>
          <div className="">
            <Input label='HRA : '  type="number"  name="hra" {...register('hra')} />
          </div>
          <div className="">
            <Input label='Allowances : '  type="number"  name="allowances" {...register('allowances')} />
          </div>
          <div className="">
            <Input label='Total : '  type="number"  name="total" {...register('total')} />
          </div>
        </div>
        {/*  */}
        {/* <div className="grid  md:grid-cols-1">
           
        </div> */}
        <div className="grid  md:grid-cols-1">
            <div className="flex justify-center mt-12">
              <button className="w-40 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Register</button>
            </div>
        </div> 
      </form>
    </>
  )
}

export default ProfessionalDetailsForm