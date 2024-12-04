import express from 'express'
import dotenv   from 'dotenv';
import dbConnection from './config/dbConnection.js';
import cors from 'cors'
import AttendanceRouter from './routers/biometricattendance/biometric.attendance.route.js';
import employeeRouter from './routers/employees/employee.route.js';
import shiftRouter from './routers/shift/shift.route.js';
import authRouter from './routers/authorization/auth.router.js';
import leaveRouter from './routers/leaves/leave.route.js';
import cookieParser from 'cookie-parser';
import policyRouter from './routers/policy/policy.route.js';
import picklistRouter from './routers/configuration/picklist.route.js';

const app = express();
dotenv.config();
app.use(cors()); // to sort out the cross origin error
app.use(express.json()); // to Access the form body data
app.use(cookieParser()); // to Access the request Cookie



const PORT = process.env.PORT || 8000;

// testing end points
app.get('/',(req,res)=>{
  res.send('this is get request');
})

// endpoint to add bio-metric data to our db
app.use('/api/biometric',AttendanceRouter);

// endpoint to create and manage employee
app.use('/api/employee',employeeRouter);

// endpoint to create and manage employee Shifts
app.use('/api/shift',shiftRouter);

// endpoint for authorization
app.use('/api/authorize',authRouter);

// endpoint for picklist
app.use('/api/configure',picklistRouter);

// end point for Leaves apply
app.use('/leaves',leaveRouter)

app.listen(PORT,()=>{
  console.log(`server started to listern on port ${PORT}`);
  dbConnection();
});

