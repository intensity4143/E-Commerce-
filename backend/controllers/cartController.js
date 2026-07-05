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

// save item for later (move from cart to savedItems)
const saveForLater = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) return res.json({ success: false, message: 'User not found' });

    const cartData = user.cartData || {};
    const savedItems = user.savedItems || {};

    // remove from cart
    if (cartData[itemId]) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
    }

    // add to saved
    if (!savedItems[itemId]) savedItems[itemId] = {};
    savedItems[itemId][size] = true;

    await UserModel.findByIdAndUpdate(userId, { cartData, savedItems });
    return res.json({ success: true, message: 'Saved for later' });
  } catch (error) {
    return res.json({ success: false, message: 'Error saving item' });
  }
};

// move saved item back to cart
const moveToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) return res.json({ success: false, message: 'User not found' });

    const cartData = user.cartData || {};
    const savedItems = user.savedItems || {};

    // add to cart
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    // remove from saved
    if (savedItems[itemId]) {
      delete savedItems[itemId][size];
      if (Object.keys(savedItems[itemId]).length === 0) delete savedItems[itemId];
    }

    await UserModel.findByIdAndUpdate(userId, { cartData, savedItems });
    return res.json({ success: true, message: 'Moved to cart' });
  } catch (error) {
    return res.json({ success: false, message: 'Error moving to cart' });
  }
};

// remove a saved item
const removeSavedItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) return res.json({ success: false, message: 'User not found' });

    const savedItems = user.savedItems || {};
    if (savedItems[itemId]) {
      delete savedItems[itemId][size];
      if (Object.keys(savedItems[itemId]).length === 0) delete savedItems[itemId];
    }

    await UserModel.findByIdAndUpdate(userId, { savedItems });
    return res.json({ success: true, message: 'Removed from saved' });
  } catch (error) {
    return res.json({ success: false, message: 'Error removing saved item' });
  }
};

// get saved items
const getSavedItems = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.json({ success: false, message: 'User not found' });
    return res.json({ success: true, savedItems: user.savedItems || {} });
  } catch (error) {
    return res.json({ success: false, message: 'Error fetching saved items' });
  }
};

module.exports =  { addToCart, updateCart, getUserCart, saveForLater, moveToCart, removeSavedItem, getSavedItems };

