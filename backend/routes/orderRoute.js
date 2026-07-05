const express = require('express');
const orderRouter = express.Router();

const adminAuth = require('../middleware/adminAuth');
const authUser = require('../middleware/auth');
const {
    placeOrder, placeOrderStripe, placeOrderRazorpay,
    allOrders, userOrders, getOrderById,
    updateStatus, verifyStripe, verifyRazorpay,
} = require('../controllers/orderController');

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment routes
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);

// User routes
orderRouter.post('/userOrders', authUser, userOrders);
orderRouter.get('/detail/:orderId', authUser, getOrderById);

// Verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripe);
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay);

module.exports = orderRouter;
