import express  from 'express'
import { addHolidays } from '../../controllers/holiday/holiday.controller.js'; 
import { authenticate } from '../../helpers/authenticateEmployee.js';

const holidayRouter = express.Router();


holidayRouter.post('/addHolidays',authenticate,addHolidays);


export default holidayRouter;

