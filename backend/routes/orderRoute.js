const express = require('express');
const orderRouter = express.Router();

const adminAuth = require('../middleware/adminAuth')
const authUser = require('../middleware/auth')
const {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus} = require('../controllers/orderController');


// Admin Features routes
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features routes
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razor', authUser, placeOrderRazorpay)

// User Feature
orderRouter.post('/userOrders', authUser, userOrders)

module.exports = orderRouter;
