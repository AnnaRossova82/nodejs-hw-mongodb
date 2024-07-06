import express from 'express';
import { register } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { userRegisterSchema } from '../validations/authSchemas.js';
import { login } from '../controllers/auth.js';
import { userLoginSchema } from '../validations/authSchemas.js';
import { refresh } from '../controllers/auth.js';
import { logout } from '../controllers/auth.js';



const router = express.Router();

router.post('/login', validateBody(userLoginSchema), login);

router.post('/register', validateBody(userRegisterSchema), register);

router.post('/refresh', refresh);

router.post('/logout', logout);

export default router;
