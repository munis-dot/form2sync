import { Router } from 'express';
import { sendOtp, signup, verifyOtp } from '../controller/authController.js';

const router = Router();

router.post('/sendOtp', sendOtp);
router.post('/verifyOtp', verifyOtp);
router.post('/singup', signup);

export default router;
