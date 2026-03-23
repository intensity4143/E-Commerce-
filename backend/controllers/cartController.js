const UserModel = require('../models/UserModel')

// add products to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const {itemId, size } = req.body;

    const user = await UserModel.findById(userId);

    // if user not found
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartData = user.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await UserModel.findByIdAndUpdate(userId, { cartData });

    return res.json({
      success: true,
      message: "Added to Cart",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error while Adding to Cart",
    });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const {itemId, size, quantity } = req.body;

    const user = await UserModel.findById(userId);

    // if user not found
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};

    
    if(quantity == 0){
      // if quantity is 0 then remove that size
      if(cartData[itemId] && cartData[itemId][size]){
        delete cartData[itemId][size]
      }

      // if no sizes left than delete item
      if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
      }
    }

    else
      cartData[itemId][size] = quantity;

    await UserModel.findByIdAndUpdate(userId, { cartData });

    return res.json({
      success: true,
      message: "Cart Updated",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error while Updating Cart",
    });
  }
};

// update user cart
const getUserCart = async (req, res) => {
  const userId = req.userId;

  const user = await UserModel.findById(userId);
  // if user not found
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  let cartData = user.cartData;

  res.json({
    success: true,
    cartData,
  });
};

module.exports =  { addToCart, updateCart, getUserCart };
