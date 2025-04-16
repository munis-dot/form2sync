import { Router } from "express";
import authRoutes from './authRoutes.js'
import newsRouter from "./newsRoute.js";
import stockRoutes from "./stockRoutes.js";
import homeRoutes from "./homeRoutes.js";
import adRoute from "./adRoutes.js";
import orderRouter from "./orderRoutes.js";
import { getNotificationsByUser } from "../controller/notificationController.js";
import MessageSchema from "../models/MessageSchema.js";
import msgRouter from "./msgRoutes.js";
import feedbackRouter from './feedbackRoutes.js'
const router = Router();


router.use('/auth', authRoutes)
router.use('/news', newsRouter)
router.use('/stock', stockRoutes);
router.use('/', homeRoutes);
router.use('/ad', adRoute);
router.use('/orders',orderRouter)
router.get('/notifications/:userId', getNotificationsByUser);
router.use('/chat',msgRouter)
router.use('/feedback',feedbackRouter)

export { router }