const express = require('express');
const cartRouter = express.Router();

const {addToCart, updateCart, getUserCart} = require('../controllers/cartController');
const authUser = require('../middleware/auth');

cartRouter.post('/get', authUser, getUserCart)
cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/update', authUser, updateCart)

module.exports = cartRouter