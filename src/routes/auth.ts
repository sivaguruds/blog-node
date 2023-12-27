import { Router } from 'express';
import { register } from '../controllers/auth.controller';
import { userCreateValidator } from '../validators/userValidators';

const router = Router();

router.post('/register', userCreateValidator, register);

export default router;
