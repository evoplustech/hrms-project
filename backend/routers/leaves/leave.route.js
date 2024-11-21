import express from 'express'
import { applyLeave, addLeaveType } from '../../controllers/leave/leave.controller.js';

const leaveRouter = express.Router();

leaveRouter.post('/applyleave', applyLeave).post('/addleavetype',addLeaveType)

export default  leaveRouter