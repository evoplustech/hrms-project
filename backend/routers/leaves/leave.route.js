import express from 'express'
import { applyLeave, addLeaveType, cancelLeave, leaveAction, getLeaveDetails, getLeaveTypes, leaveReport } from '../../controllers/leave/leave.controller.js';
import { authenticate } from '../../helpers/authenticateEmployee.js';

const leaveRouter = express.Router();


leaveRouter
.post('/applyleave', authenticate, applyLeave)
.post('/addleavetype', authenticate, addLeaveType)
// .post('/cancelleave', authenticate, cancelLeave)
.post('/leaveAction', authenticate, leaveAction)
.post('/getleavedetails',authenticate,getLeaveDetails)
.get('/getleavetypes',authenticate,getLeaveTypes)
.post("/leavereports",authenticate,leaveReport)


export default  leaveRouter