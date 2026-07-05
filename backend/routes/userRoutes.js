const express = require('express');
const userRouter = express.Router();
const authUser = require('../middleware/auth');
const {
    loginUser, registerUser, adminLogin,
    getProfile, updateProfile, changePassword,
    addAddress, updateAddress, deleteAddress, setDefaultAddress,
} = require('../controllers/userController');

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/profile', authUser, getProfile);
userRouter.put('/profile', authUser, updateProfile);
userRouter.put('/change-password', authUser, changePassword);
userRouter.post('/address/add', authUser, addAddress);
userRouter.put('/address/update', authUser, updateAddress);
userRouter.delete('/address/delete', authUser, deleteAddress);
userRouter.put('/address/set-default', authUser, setDefaultAddress);

module.exports = userRouter;
