const express = require('express');
const productRouter = express.Router();

const {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct
} = require('../controllers/productController');

const upload = require('../middleware/multer');

// add product
productRouter.post(
  '/add',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

// get all products
productRouter.get('/list', listProducts);

// get single product
productRouter.get('/single/:id', singleProduct);

// delete product
productRouter.delete('/remove/:id', removeProduct);

module.exports = productRouter;