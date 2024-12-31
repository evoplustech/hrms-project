import express from 'express'
import { createRole,updateRole,deleteAndRestoreRole,getAllRoles } from '../../controllers/configuration/picklist.controller.js';
import { getAllDept,createDept,updateDept,deleteAndRestoreDept } from '../../controllers/configuration/picklist.department.js';
import { getAllDesig,getRevelentDesig,createDesig,updateDesig,deleteAndRestoreDesig} from '../../controllers/configuration/picklist.designation.js';
import { authenticate } from '../../helpers/authenticateEmployee.js';
import { createModule,getAllModules } from '../../controllers/configuration/module.controller.js';


const picklistRouter = express.Router();

picklistRouter
.get('/picklist/role/getAll',authenticate,getAllRoles)
.post('/picklist/role/create',authenticate,createRole)
.put('/picklist/role/update/:id',authenticate,updateRole)
.get('/picklist/role/activateDeactivate/:id',authenticate,deleteAndRestoreRole)
.get('/picklist/department/getAll',authenticate,getAllDept)
.post('/picklist/department/create',authenticate,createDept)
.put('/picklist/department/update/:id',authenticate,updateDept)
.get('/picklist/department/activateDeactivate/:id',authenticate,deleteAndRestoreDept)
.get('/picklist/designation/getAll',authenticate,getAllDesig)
.get('/picklist/designation/selectDesig/:department',authenticate,getRevelentDesig)
.post('/picklist/designation/create',authenticate,createDesig)
.put('/picklist/designation/update/:id',authenticate,updateDesig)
.get('/picklist/designation/activateDeactivate/:id',authenticate,deleteAndRestoreDesig)
.post('/module/create',authenticate,createModule)
.get('/module/getAll',authenticate,getAllModules);



export default picklistRouter;