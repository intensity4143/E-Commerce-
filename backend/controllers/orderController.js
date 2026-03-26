const orderModel = require("../models/orderModel");
const UserModel = require("../models/UserModel");
const Stripe = require("stripe")
const razorpay = require('razorpay')

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const RazorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY
})

// global variables
const currency = 'inr'
const deliveryCharge = 10


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
const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    return res.json({
      success: true,
      session_url: session.url,
    });
  } 
  catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error while placing order",
    });
  }
};

// verify Stripe (to make changes when payment is successful)
const verifyStripe = async (req, res) => {
  const userId = req.userId
  const {orderId, success} = req.body;

  try {
    if(success === 'true'){
      // change payment to true and make cart empty
      await orderModel.findByIdAndUpdate(orderId, {payment:true})
      await UserModel.findByIdAndUpdate(userId, {cartData:{}})

      return res.json({
        success: true
      })
    }
    else{
      // if payment fails then delete order
      await orderModel.findByIdAndDelete(orderId)
      return res.json({
        success:false
      })
    }

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Payment error!",
    });
  }
}

// Placing orders using Razorpay
const placeOrderRazorpay = async (req, res) => {
  try {
      const userId = req.userId;
      const { items, amount, address } = req.body;

      const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod: "Razorpay",
        payment: false,
        date: Date.now(),
      };

      const newOrder = new orderModel(orderData);
      await newOrder.save();

      const options = {
        amount: amount * 100,
        currency: currency.toUpperCase(),
        receipt: newOrder._id.toString()
      }

      await RazorpayInstance.orders.create(options, (error, order) =>{
        if(error){
          console.log(error)
          return res.json({
            success:false,
            message: error
          })
        }
        
        return res.json({
          success:true,
          order
        })
      })
  } 
  catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Payment error!",
    });
  }
};

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
const updateStatus = async (req, res) => {
  try {
    
    const{orderId, status} = req.body;

    await orderModel.findByIdAndUpdate(orderId, {status});
    res.json({
      success: true,
      message: "Status Updated"
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

module.exports = {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  verifyStripe,
  allOrders,
  userOrders,
  updateStatus,
};
