import React, { useEffect } from 'react'
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import useSelectorHook from '../../../../utils/useSelectorHook';
import EmployeePopUp from './EmployeePopUp';
import { useDispatch } from 'react-redux';
import { fetchAttendance } from '../../../slices/attendanceSlice';

const ListData = ({route}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const employeeList = useSelectorHook('employee');
    const empData = useSelectorHook('authenticate');
    let columns;let data;

  const employeeHandler = async (param)=>{
    console.log('tharakkioioioioi',param,'route',route);
    if(route ==='Employee'){
      localStorage.removeItem('employeeTab');
      const navLink = `/home/employee/updateEmployee/${param}`;
      navigate(navLink);
    }else{
      console.log('ddddddddddddd',empData['data'].employeeId);
      const navLink = `/home/attendance/${empData['data'].employeeId}`;
      await dispatch(fetchAttendance({id:param,dateParam:new Date()}));
      navigate(navLink);
    }
    
    // route to the updating component
  }
  columns = [
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
      label:'Action'
    },];

    data = employeeList['data'].map((value)=>{
  
      return  {
         '_id':value._id,
         'perId':value['empPersonalId'] ? value['empPersonalId']._id:value._id,
         'Employee Name': value['empPersonalId'] ? value['empPersonalId'].firstName+' '+value['empPersonalId'].lastName : value.firstName+' '+value.lastName,
         'Username' : value.email,
         'Department':value['department'] ? value['department'].name :'',
         'Designation' : value['designation']? value['designation'].name :'',
         'Role' : value['role'] ? value['role'].name :'',
         'active' : value.isActive ? 'yes':'no' ,
         'action' :value['empPersonalId']? <span className= "w-2" onClick={(e)=>(e.stopPropagation())}><EmployeePopUp personId={value['empPersonalId']._id} isActive = {value.isActive} id="dropdownDelayButton" /></span>:''
       }
   });
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
      console.log('dataoooo',data,data[1]);
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