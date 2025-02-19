import { Router } from 'express';
import { login, sendOtp, signup, verifyOtp } from '../controller/authController.js';

const router = Router();

router.post('/sendOtp', sendOtp);
router.post('/verifyOtp', verifyOtp);
router.post('/signup', signup);
router.post('/login', login);

export default router;
