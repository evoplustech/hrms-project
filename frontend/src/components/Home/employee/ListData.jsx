import React, { useEffect } from 'react'
import MUIDataTable from "mui-datatables";
import useGetData from '../../../hooks/useGetData';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import useSelectorHook from '../../../../utils/useSelectorHook';
import { PiDotsThreeVerticalDuotone,PiDotsThreeOutlineVerticalDuotone  } from "react-icons/pi";
import EmployeePopUp from './EmployeePopUp';

const ListData = () => {

    const navigate = useNavigate();

  const employeeHandler = (param)=>{
    localStorage.removeItem('employeeTab');
    const navLink = `/home/employee/updateEmployee/${param}`;
    navigate(navLink);
    // route to the updating component
  }

  const columns = [
    {
      name:'_id',
      label:'id',
      options: {
      display: 'excluded',  // Hide in the UI
      download: false, // Exclude from the download
    }
    },
    {
      name:'perId',
      label:'perId',
      options: {
      display: 'excluded',  // Hide in the UI
      download: false, // Exclude from the download
    }
    },
    {
      name:'Employee Name',
      label :'Employee Name',
      // options: {
      //   display: 'excluded' // This hides the _id column in the table
      // }
    },
    {
      name:'Username',
      label :'User Name'
    },
    {
      name:'Department',
      label :'Department'
    },
    {
      name:'Designation',
      label :'Designation'
    },
    {
      name:'Role',
      label :'Role'
    },
    {
      name:'active'
    },{
      name:'action',
      label:' '
    },];

  // const [loaddept,employeeList] = useGetData({path : '/api/employee/getAllRecords',method:'get'});
  const employeeList = useSelectorHook('employee');
  console.log('employee List',employeeList);
  

const getMuiTheme = () => createTheme({
  components: {
    MuiTableCell: {
      styleOverrides:{
        head: {
          padding: '15px',
	        backgroundColor: '#7fe0bb',
	        color: '#fff',
          fontWeight:'bold'
        },
        body:{
          
        }
      }
    }
  }
})
 
const data = employeeList['data'].map((value)=>{
 
   return  {
      '_id':value._id,
      'perId':value['empPersonalId']._id,
      'Employee Name': value['empPersonalId'].firstName+' '+value['empPersonalId'].lastName,
      'Username' : value.email,
      'Department':value['department'].name,
      'Designation' : value['designation'].name,
      'Role' : value['role'].name,
      'active' : value.isActive ? 'yes':'no' ,
      'action' :<span className= "w-2" onClick={(e)=>(e.stopPropagation())}><EmployeePopUp personId={value['empPersonalId']._id} id="dropdownDelayButton" /></span>
      
    }
});

console.log(data);

  const options = {
    selectableRows:'none',
    elevation:0,
    rowsPerPage:10,
    expandableRowsOnClick: true,
    customRowRender:(data, dataIndex, rowIndex, rowData, columnMeta)=>{
      const customAttribute =data[0];
      // const empid={} ;
      // empid.perId = data[0];
      // empid.proId = data[1];
      return (
      <tr className="hover:cursor-pointer hover:bg-gray-200"  onClick={()=>employeeHandler(data[1])}>
        {
          data.map((value,index)=>(
            index>1? <td className=" p-6" key={index}>{value}</td>:''
          ))
        }
      </tr>
      )
    },
    rowsPerPageOptions:[5,10,15]
  };



  return (
    <div>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable  title={"Employee List"} data={data} columns={columns}  options={options} />
      </ThemeProvider>
    </div>
  )
}

export default ListData