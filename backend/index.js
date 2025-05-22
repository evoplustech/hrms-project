import express, { response } from 'express'
import dotenv   from 'dotenv';
import dbConnection from './config/dbConnection.js';
import cors from 'cors'
import biometricRouter from './routers/biometricattendance/biometric.attendance.route.js';
import employeeRouter from './routers/employees/employee.route.js';
import shiftRouter from './routers/shift/shift.route.js';
import authRouter from './routers/authorization/auth.router.js';
import leaveRouter from './routers/leaves/leave.route.js';
import cookieParser from 'cookie-parser';
import picklistRouter from './routers/configuration/config.route.js';
import holidayRouter from './routers/holiday/holiday.route.js';
import attendanceRouter from './routers/attendance/attendance.router.js';
import policyRouter from './routers/policy/policy.route.js';
import path from 'path';

const app = express();
dotenv.config();
app.use(cors()); // to sort out the cross origin error
app.use(express.json()); // to Access the form body data
app.use(cookieParser()); // to Access the request Cookie



const PORT = process.env.PORT || 8000;
// to get absolute file Path
const _dirname = path.resolve();

// testing end points
app.get('/ten/one',(req,res)=>{
  const x= new Date();
  
  res.status(200).send(x);
  // res.redirect(301,'https://localhost:6500/api/authorize/logout');
})
app.get("/connectioncheck",(req,res)=>{
  res.status(200).send('<h1>BackEnd Running...</h1>')
})
// endpoint to add bio-metric data to our db
app.use('/api/biometric',biometricRouter);

// endpoint to create and manage employee
app.use('/api/employee',employeeRouter);

// enpoint to get,update Employee Attendance from DB
app.use('/api/attendance',attendanceRouter);

// endpoint to create and manage employee Shifts
app.use('/api/shift',shiftRouter);

// endpoint to create manage organization holidays

app.use('/api/holiday',holidayRouter);

// endpoint for authorization
app.use('/api/authorize',authRouter);

// endpoint for picklist
app.use('/api/configure',picklistRouter);

// end point for Leaves apply
app.use('/api/leaves',leaveRouter)

app.use('/api/policy',policyRouter)

// to host static file 
app.use(express.static(path.join(_dirname,'frontend','dist')));

app.get('*',(_response)=>{
    response.status(200).sendFile(path.join(_dirname,'frontend','dist'));
})

app.listen(PORT,()=>{
  console.log(`server started to listern on porto ${PORT}`);
  dbConnection();
});

