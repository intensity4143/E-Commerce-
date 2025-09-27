import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";


const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

const fetChProductData = () => {
  const foundProduct = products.find((item) => item._id === productId);
  if (foundProduct) {
    setProductData(foundProduct);
    setImage(foundProduct.image[0]);
  }
};


  useEffect(() => {
    fetChProductData();
  }, [productId]);

  return productData ? (
    <div className="border-t pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* ---------------- product data ------------ */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* -------------Product Images ---------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                src={item}
                alt=""
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer "
                onClick={() => setImage(item)}
              />
            ))}
          </div>

          {/* ------------- product main image ---------- */}
          <div className="w-full sm:w-[80%]">
            <img src={image} alt="" className="w-full h-auto" />
          </div>
        </div>

        {/* ------ product Info ---------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(1008)</p>
          </div>

          {/* ----- product price ----- */}
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>

          {/* --- product description */}
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="felx flex-col gap-4 my-8">

            {/* --- product size --- */}
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  className={` py-2 px-4 ${
                    item === size ? "bg-blue-700 text-white" : "bg-gray-100 "
                  }`}
                  key={index}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* --- add to cart button --- */}
          <button className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">ADD TO CART</button>

          <hr className="mt-8 sm:w-4/5"/>
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>


      {/* -------- Description and Review Section ------- */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className=" border px-5 py-3 text-sm">Reviews (235)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus perferendis tenetur voluptate inventore culpa rem placeat aliquid ea, aperiam esse dolores dolorum ipsum similique vel quos, iste natus quaerat. Quos dolores rem architecto esse perspiciatis ratione laudantium eligendi ullam reiciendis. Dolorem dolorum in iure sunt expedita rerum laboriosam vitae? Impedit?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia molestiae harum nobis quae voluptatibus vel distinctio! Odio aliquam incidunt quisquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, eius!</p>
        </div>
      </div>

      {/* -------- Display related Products ---------- */}

      <RelatedProducts category = {productData.category} subCategory = {productData.subCategory}/>

    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
