const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    uerId:{
        type : String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Order Placed'
    },
    paymentMethod: {
        type: String, 
        required: true
    },
    payment: {
        type: Boolean,
        required: true
    },
    date: {
        type: Number,
        required: true
    }
},{timestamps: true})


module.exports = mongoose.model("Order", orderSchema);