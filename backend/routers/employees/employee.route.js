import express from 'express'
import { createPersonalDetail,updatePersonalDetail,deletePersonalDetail, getAllPersonalDetail } from '../../controllers/employees/employee.personal.controller.js';
import { createProfDetail,updateProRecord,deleteProRecord, getReportingManagerList } from '../../controllers/employees/employee.professional.controller.js';


const employeeRouter = express.Router();

employeeRouter.get('/getAll/personal',getAllPersonalDetail)
.post('/create/personal',createPersonalDetail)
.put('/update/personal/:empID',updatePersonalDetail)
.delete('/delete/personal/:empID',deletePersonalDetail)
.post('/create/professional',createProfDetail)
.put('/update/professional/:empId',updateProRecord)
.delete('/delete/professional/:empId',deleteProRecord)
.get('/getreportingmanagers',getReportingManagerList);

export default employeeRouter;


