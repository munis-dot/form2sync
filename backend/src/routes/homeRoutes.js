import express from 'express';
import { getHomeData } from '../controller/homeController.js';

const router = express.Router();

// Define home route
router.get('/home', getHomeData);

export default router;
