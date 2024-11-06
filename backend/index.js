import express from 'express'
import  dotenv   from 'dotenv';
import dbConnection from './config/dbConnection.js';
import cors from 'cors'
import AttendanceRouter from './routers/biometricattendance/biometric.attendance.route.js';
import employeeRouter from './routers/employees/employee.route.js';
import shiftRouter from './routers/shift/shift.route.js';

const app = express();
dotenv.config();
app.use(cors()); // to sort out the cross origin error
app.use(express.json()); // to Access the form body data



const PORT = process.env.PORT || 8000;

// testing end points
app.get('/',(req,res)=>{
    res.send('this is get request');
})

// endpoint to add bio-metric data to our db
app.use('/biometric',AttendanceRouter);

// endpoint to create and manage employee
app.use('/employee',employeeRouter);

// endpoint to create and manage employee Shifts
app.use('/shift',shiftRouter);


app.listen(PORT,()=>{
  console.log(`server started to listern on port ${PORT}`);
  dbConnection();
});


