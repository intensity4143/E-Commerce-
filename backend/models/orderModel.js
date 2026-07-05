const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        sparse: true,
    },
    userId: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    subtotal: {
        type: Number,
        default: 0,
    },
    shippingCharge: {
        type: Number,
        default: 10,
    },
    discount: {
        type: Number,
        default: 0,
    },
    tax: {
        type: Number,
        default: 0,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Order Placed',
        enum: ['Order Placed', 'Processing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'],
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    payment: {
        type: Boolean,
        required: true,
        default: false,
    },
    date: {
        type: Number,
        required: true,
    },
    paymentOrderId: {
        type: String,
        default: '',
    },
    paymentId: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
