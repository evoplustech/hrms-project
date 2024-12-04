import express from 'express'
import  dotenv   from 'dotenv';
import dbConnection from './config/dbConnection.js';
import cors from 'cors'
import AttendanceRouter from './routers/biometricattendance/biometric.attendance.route.js';
import employeeRouter from './routers/employees/employee.route.js';
import shiftRouter from './routers/shift/shift.route.js';
import authRouter from './routers/authorization/auth.router.js';
import leaveRouter from './routers/leaves/leave.route.js';
import cookieParser from 'cookie-parser';
<<<<<<< HEAD
import policyRouter from './routers/policy/policy.route.js';
=======
import picklistRouter from './routers/configuration/picklist.route.js';
>>>>>>> 0f95254014af67d6a800100ac16e633f4c590e56

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

<<<<<<< HEAD
// end point for Add/Delete/Update and get the Policies
app.use('/policy',policyRouter)
=======
// endpoint for picklist
app.use('/api/configure',picklistRouter);

>>>>>>> 0f95254014af67d6a800100ac16e633f4c590e56

// end point for Leaves apply
app.use('/leaves',leaveRouter)

app.listen(PORT,()=>{
  console.log(`server started to listern on port ${PORT}`);
  dbConnection();
});

