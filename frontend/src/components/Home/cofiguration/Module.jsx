import React, { useState } from 'react'
import Input from '../../form/Input'
import { VscDiffAdded } from "react-icons/vsc";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { nanoid } from 'nanoid'
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createMoule } from '../../../slices/moduleSlice';
import useSelectorHook from '../../../../utils/useSelectorHook';
import toast from 'react-hot-toast';


const Module = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  const dispatch = useDispatch();
  const modules = useSelectorHook('module');
  const schema = z.object({
    module : z.string().min(1,'Module Name is Required'),
    // category : z.string().min(1,'category is Required'),
    categoryList:z.record(z.string().min(1,'category is Required'))
  });

  const {register,unregister,handleSubmit,formState : {errors}} = useForm({
    resolver : zodResolver(schema)
  });

  const [catagary,setCatagory] = useState(1);


  

  const clickHandler =  (params,fieldName)=>{
    if(params==='remove')
       unregister(fieldName);
  
    setCatagory((prevState)=>{
      switch(params){
        case 'add': return ++prevState;
        case 'remove' :  return prevState > 0 ? prevState - 1 : 0;
      }
      // return params ==='add' ?  ++prevState : (unregister(fieldName),--prevState);
    });
  }

  const formSubmit = async (formData)=>{
      await dispatch(createMoule(formData));
      if(modules.error !== null)
        toast.error(modules.error);
      else
        toast.success('module created successfully');
  }


  return (
    <>

<div id="accordion-collapse" data-accordion="collapse">
      <h2 id="accordion-collapse-heading-1">
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
          onClick={toggleAccordion} // Toggle on button click
          aria-expanded={isOpen} // Dynamically update aria-expanded based on the state
          aria-controls="accordion-collapse-body-1"
        >
          <span>What is Flowbite?</span>
          <svg
            data-accordion-icon
            className={`w-3 h-3 ${isOpen ? 'rotate-180' : ''} shrink-0`} // Rotate based on isOpen state
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id="accordion-collapse-body-1"
        className={`transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`} // Toggle visibility based on isOpen
        aria-labelledby="accordion-collapse-heading-1"
      >
        <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Check out this guide to learn how to{' '}
            <a
              href="/docs/getting-started/introduction/"
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              get started
            </a>{' '}
            and start developing websites even faster with components on top of Tailwind CSS.
          </p>
        </div>
      </div>
    </div>

      <section>
        <h1 className="text-xl">Create Module</h1>
        <form method="post" onSubmit = {handleSubmit(formSubmit)}>
          <div className="mt-10 space-y-24">
            <div className="grid  md:grid-cols-1">
              <div className="">
                <Input label='Module Name : ' name="module" type="text" className="w-72" {...register('module')} />
                {errors?.module && <p className="text-red-600">{errors.module.message}</p>}
              </div>
            </div>
            <h2 className="text-xl text-gray-800 mt-4">Catagories:</h2>
            {
              catagary > 0 ? new Array(catagary).fill(0).map((value,key)=>(
                <div key = {key} className="grid   md:grid-cols-2 max-[1358px]:-space-x-52 -space-x-80 space-y-2">
                  <div className="w-72">
                      <Input label='category : ' name ={`categoryList[category${key}]`} {...register(`categoryList.category${key}`)}  type="text" className="w-72 " />
                      {errors.categoryList?.[`category${key}`] && <p className="text-red-600">{errors.categoryList[`category${key}`].message}</p>}
                  </div>
                  <div>
                    {
                      key===0 ? 
                      <button className="" onClick={(e)=>(e.preventDefault(),clickHandler('add',`categoryList.category${key}`))}>
                        <VscDiffAdded  className="w-7 h-7" />
                      </button> : 
                      <button onClick={(e)=>(e.preventDefault(),(clickHandler('remove',`categoryList.category${key}`)))}>
                        <MdOutlineRemoveCircleOutline className="w-5 h-5" />
                       </button>
                    }
                  </div>
                </div>
              )):''
            }
            
          </div>
          <div className=" flex justify-center items-center mt-20">
            <button type='submit' className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800  rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-semibold">Create Module</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Module