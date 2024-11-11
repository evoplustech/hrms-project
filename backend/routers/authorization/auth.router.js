import express from 'express';
import { loginEmployee,logOutEmployee } from '../../controllers/authorization/auth.controller.js';
import { authenticate } from '../../helpers/authenticateEmployee.js';

const authRouter = express.Router();


authRouter.post('/login',loginEmployee)
.get('/logout',logOutEmployee);


export default authRouter;


