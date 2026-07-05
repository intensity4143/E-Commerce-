const express = require('express');
const cartRouter = express.Router();

const {addToCart, updateCart, getUserCart, saveForLater, moveToCart, removeSavedItem, getSavedItems} = require('../controllers/cartController');
const authUser = require('../middleware/auth');

cartRouter.post('/get', authUser, getUserCart)
cartRouter.post('/add', authUser, addToCart)
cartRouter.post('/update', authUser, updateCart)
cartRouter.post('/save', authUser, saveForLater)
cartRouter.post('/move-to-cart', authUser, moveToCart)
cartRouter.post('/remove-saved', authUser, removeSavedItem)
cartRouter.post('/get-saved', authUser, getSavedItems)

module.exports = cartRouter