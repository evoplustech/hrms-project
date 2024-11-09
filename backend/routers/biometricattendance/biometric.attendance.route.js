import express from 'express'
import { addBiometricDevice, fetchAttendance, getBiometricDevice } from '../../controllers/biometricattendance/biometric.attendance.controller.js';

const AttendanceRouter = express.Router();

  

AttendanceRouter.post('/attendance', fetchAttendance).post('/addbiometricdevice', addBiometricDevice).get('/getbiometricdevice', getBiometricDevice);


export default AttendanceRouter;



