import express from 'express'
import { applyLeave, addLeaveType, cancelLeave, leaveAction } from '../../controllers/leave/leave.controller.js';
import { authenticate } from '../../helpers/authenticateEmployee.js';

const leaveRouter = express.Router();


leaveRouter
.post('/applyleave', authenticate, applyLeave)
.post('/addleavetype', authenticate, addLeaveType)
.post('/cancelleave', authenticate, cancelLeave)
.post('/leaveAction', authenticate, leaveAction)

export default  leaveRouter