import express from 'express';
import { cancelOrderByUser, getSalesAnalytics, getSellerOrders, getUserOrders, placeOrder, updateOrderStatusBySeller } from '../controller/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/', placeOrder);
orderRouter.get('/seller/:farmName', getSellerOrders);
orderRouter.patch('/seller/:orderId/status', updateOrderStatusBySeller);

// User routes
orderRouter.get('/user/:id', getUserOrders);
orderRouter.patch('/user/:orderId/cancel', cancelOrderByUser);
orderRouter.get('/analytics/:farmName',getSalesAnalytics)

export default orderRouter;