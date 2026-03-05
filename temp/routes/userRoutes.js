const express = require('express');
const userRouter = express.Router();

const {userLogin, registerUser, adminLogin, loginUser} = require('../controllers/userController')

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)

module.exports = userRouter;