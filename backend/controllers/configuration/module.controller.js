import categoryModel from "../../models/configuration/Category.model.js";
import moduleModel from "../../models/configuration/module.model.js";
import fs from 'fs';
import path from 'path';

const createModule = async (request,response)=>{
try{
  const {role:empRole} = request;
  const {module,categoryList} = request.body;
  const category = [];
  let catageryData;

  if(empRole.toLowerCase() !=='admin')
     return response.status(403).json({ error: "Access denied. You do not have permission to perform this action.",success:false});

  if(!module || !categoryList || Object.entries(categoryList).length <= 0)
    return response.status(422).json({error:"Validation failed Form Fields Missing",success:false});
   
  for(let i=0;i<Object.entries(categoryList).length;i++){
      catageryData = await categoryModel.create({name:categoryList[`category${i}`]});
      category.push({_id:catageryData._id});
  }

  if(Object.entries(category).length <=0)
    throw new Error('No Category Added');

    const moduleData =  await moduleModel.create({name:module,category});
    // if(!moduleData)
    //   return response.status(422).json({error:"Validation failed Form Fields Missing",success:false});

    response.status(200).json({data:moduleData,message:"Module Created Successfully",success:true});
}catch(error){
  console.log(error.message);
  response.status(500).json({error:"Internal Server Error",success:false});
}
}

const getAllModules = async (request,response)=>{
  try{

    const modules = await moduleModel.find().populate('category','name');

    response.status(200).json({data:modules,message:"Module fetched Successfully",success:true});

  }catch(error){
    console.log(error.message);
    response.status(500).json({error:"Internal Server Error",success:false});
  }
}

export {createModule,getAllModules}