import express from 'express';
import { register } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { userRegisterSchema } from '../validations/authSchemas.js';

const router = express.Router();

router.post('/register', validateBody(userRegisterSchema), register);

export default router;
