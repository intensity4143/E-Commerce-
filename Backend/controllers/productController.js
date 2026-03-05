const Product = require("../models/ProductModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// controller for adding product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files?.image1?.[0] || null;
    const image2 = req.files?.image2?.[0] || null;
    const image3 = req.files?.image3?.[0] || null;
    const image4 = req.files?.image4?.[0] || null;

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== null,
    );

    // uploading images on cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          folder: "TrendCart",
        });

        // remove local file after upload
        fs.unlinkSync(item.path);

        return result.secure_url;
      }),
    );

    // creating entry in database
    const product = await Product.create({
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    });

    // console.log(product)

    res.status(201).json({
      success: true,
      message: "product added",
    });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// controller for listing product
const listProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({
      success: true,
      products,
    });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// controller for removing product
const removeProduct = async (req, res) => {
  try {

    // extract id passed in url parameter
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product removed",
    });

  } 
  catch (error) {

    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
    
  }
};

// controller for single product info
const singleProduct = async (req, res) => {
  try {
    const {id} = req.params
    
    const product = await Product.findById(id);
    
    if(!product){
      return res.status(404).json({
        success:false,
        message:"Product not found!"
      })
    }
    
    return res.status(200).json({
      success:true,
      product
    })

  } 
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
    
  }
};

module.exports = {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
};
