import express from 'express'
import { fetchAttendance } from '../../controllers/biometricattendance/biometric.attendance.controller.js';

const AttendanceRouter = express.Router();

  

AttendanceRouter.post('/attendance',fetchAttendance);


export default AttendanceRouter;



