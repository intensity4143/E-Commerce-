const orderModel = require('../models/orderModel');
const UserModel = require('../models/UserModel');
const Stripe = require('stripe');
const razorpay = require('razorpay');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const RazorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const currency = 'inr';
const deliveryCharge = 10;

// generate unique order ID: ORD-YYYYMMDD-XXXXXX
const generateOrderId = () => {
    const d = new Date();
    const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const rand = Math.random().toString(36).toUpperCase().slice(2, 8);
    return `ORD-${date}-${rand}`;
};

// compute subtotal from items array
const computeSubtotal = (items) =>
    items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

// COD
const placeOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, amount, address } = req.body;

        if (!userId || !items || items.length === 0 || amount == null || !address) {
            return res.json({ success: false, message: 'Missing order details' });
        }

        const subtotal = computeSubtotal(items);
        const newOrder = new orderModel({
            orderId: generateOrderId(),
            userId,
            items,
            address,
            subtotal,
            shippingCharge: deliveryCharge,
            discount: 0,
            tax: 0,
            amount,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
        });
        await newOrder.save();
        await UserModel.findByIdAndUpdate(userId, { cartData: {} });

        return res.json({ success: true, message: 'Order Placed' });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: 'Error while Placing Order' });
    }
};

// Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, amount, address } = req.body;
        const { origin } = req.headers;

        const subtotal = computeSubtotal(items);
        const newOrder = new orderModel({
            orderId: generateOrderId(),
            userId,
            items,
            address,
            subtotal,
            shippingCharge: deliveryCharge,
            discount: 0,
            tax: 0,
            amount,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now(),
        });
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));
        line_items.push({
            price_data: {
                currency,
                product_data: { name: 'Delivery Charges' },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        await orderModel.findByIdAndUpdate(newOrder._id, { paymentOrderId: session.id });

        return res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: 'Error while placing order' });
    }
};

// verify Stripe
const verifyStripe = async (req, res) => {
    const userId = req.userId;
    const { orderId, success } = req.body;
    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await UserModel.findByIdAndUpdate(userId, { cartData: {} });
            return res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            return res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: 'Payment error!' });
    }
};

// Razorpay
const placeOrderRazorpay = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, amount, address } = req.body;

        const subtotal = computeSubtotal(items);
        const newOrder = new orderModel({
            orderId: generateOrderId(),
            userId,
            items,
            address,
            subtotal,
            shippingCharge: deliveryCharge,
            discount: 0,
            tax: 0,
            amount,
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now(),
        });
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        };
        const razorpayOrder = await RazorpayInstance.orders.create(options);
        await orderModel.findByIdAndUpdate(newOrder._id, { paymentOrderId: razorpayOrder.id });

        return res.json({ success: true, order: razorpayOrder });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: 'Payment error!' });
    }
};

// verify Razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const userId = req.userId;
        const { razorpay_order_id } = req.body;
        const orderInfo = await RazorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            const order = await orderModel.findOne({ paymentOrderId: razorpay_order_id });
            if (!order) return res.json({ success: false, message: 'Order not found' });
            await orderModel.findByIdAndUpdate(order._id, { payment: true });
            await UserModel.findByIdAndUpdate(userId, { cartData: {} });
            return res.json({ success: true, message: 'Payment Successful' });
        } else {
            return res.json({ success: false, message: 'Payment not completed' });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: 'Payment Verification failed!' });
    }
};

// Admin: all orders
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        return res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: 'Internal Server error!' });
    }
};

// User: all orders
const userOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        return res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: 'Internal server error' });
    }
};

// User: single order by orderId
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findOne({ orderId, userId: req.userId });
        if (!order) return res.json({ success: false, message: 'Order not found' });
        return res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: 'Internal server error' });
    }
};

// Admin: update status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        return res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    verifyStripe,
    verifyRazorpay,
    allOrders,
    userOrders,
    getOrderById,
    updateStatus,
};
