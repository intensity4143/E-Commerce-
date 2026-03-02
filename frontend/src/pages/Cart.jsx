import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];

    for (const item in cartItems) {
      for (const s in cartItems[item]) {
        if (cartItems[item][s] > 0) {
          tempData.push({
            _id: item,
            size: s,
            quantity: cartItems[item][s],
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id,
          );

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData.image[0]}
                  alt=""
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>

                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 bg-slate-100">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* quantity of items */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  className="bg-slate-200 font-bold w-10  cursor-pointer"
                  onClick={() =>
                    updateQuantity(item._id, item.size, item.quantity - 1)
                  }
                >
                  -
                </button>

                <input
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 text-center"
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > 0) {
                      updateQuantity(item._id, item.size, val);
                    }
                  }}
                  disabled
                />

                <button
                  className="bg-slate-200 w-10 cursor-pointer"
                  onClick={() =>
                    updateQuantity(item._id, item.size, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              {/* delete items */}
              <img
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                onClick={() => updateQuantity(item._id, item.size, 0)}
                src={assets.bin_icon}
                alt=""
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cart;
