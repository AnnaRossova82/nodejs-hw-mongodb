import express from 'express';
import { register, login, refresh, logout, sendResetEmail, resetPassword } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { userRegisterSchema, userLoginSchema, resetEmailSchema, resetPwdSchema } from '../validations/authSchemas.js';

const router = express.Router();


router.post('/register', validateBody(userRegisterSchema), register);
router.post('/login', validateBody(userLoginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/send-reset-email', validateBody(resetEmailSchema), sendResetEmail);
router.post('/reset-pwd', validateBody(resetPwdSchema), resetPassword);



export default router;
