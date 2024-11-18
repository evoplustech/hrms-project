import express from 'express'
import { applyLeave } from '../../controllers/leave/leave.controller.js';

const leaveRouter = express.Router();

leaveRouter.post('/applyleave', applyLeave)

export default  leaveRouter 