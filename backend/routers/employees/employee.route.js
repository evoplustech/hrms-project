import express from 'express'
import { createPersonalDetail } from '../../controllers/employees/employee.personal.controller.js';


const employeeRouter = express.Router();

employeeRouter.post('/create/personal',createPersonalDetail);

export default employeeRouter;


