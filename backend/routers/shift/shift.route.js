import express from 'express'
import { createShift,updateShift,deleteShift,getAllShifts } from '../../controllers/shift/shift.controller.js';

const shiftRouter = express.Router();


shiftRouter.get('/AllShifts',getAllShifts)
.post('/create',createShift)
.put('/update/:shiftId',updateShift)
.delete('/delete/:shiftId',deleteShift);

export default shiftRouter;