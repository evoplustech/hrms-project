import express from 'express'
import { fetchAttendance } from '../../controllers/biometricattendance/biometric.attendance.controller.js';
import { authenticate } from '../../helpers/authenticateEmployee.js';

const AttendanceRouter = express.Router();

  

AttendanceRouter.post('/attendance',authenticate,fetchAttendance);


export default AttendanceRouter;



