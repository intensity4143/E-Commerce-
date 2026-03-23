const orderModel = require("../models/orderModel");
const UserModel = require("../models/UserModel");

// Placing orders using COD (cash on Delivery method)
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;

    //  data validation
    if (!userId || !items || items.length === 0 || amount == null || !address) {
      return res.json({
        success: false,
        message: "Missing order details",
      });
    }

    // creating order data object to store in database
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // emptying cart data after order is placed
    await UserModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.json({
      success: true,
      message: "Order Placed",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error while Placing Order",
    });
  }
};

// Placing orders using stripe
const placeOrderStripe = async (req, res) => {};

// Placing orders using Razorpay
const placeOrderRazorpay = async (req, res) => {};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    res.json({
      success:true,
      orders
    })

  } catch (error) {
    console.log(error)
    return res.json({
      success: false,
      message: "Internal Server error!"
    })
  }
};

// All Orders data for For Frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({userId}) 

    return res.json({
      success:true,
      orders
    })
  } 
  catch (error) {
    console.log(error)
    return res.json({
      success:false,
      message:"Internal server error"
    })
  }
};

// update order status from Admin Panel
const updateStatus = async (req, res) => {};

module.exports = {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
