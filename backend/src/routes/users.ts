import { Router } from 'express';
import {getMe, googleLogin, login, logout, register} from '../controllers/users.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.post('/', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

export default router;