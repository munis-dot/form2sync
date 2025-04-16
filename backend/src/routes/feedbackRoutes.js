import express from 'express';
import { createFeedback, getFeedbackByUserId } from '../controller/feedbackController.js';

const router = express.Router();

router.post('/', createFeedback);
router.get('/:recieverId', getFeedbackByUserId);

export default router;
