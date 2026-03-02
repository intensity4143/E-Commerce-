import { createContext, useEffect, useState } from "react";
import { products } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const addToCart = async (itemId, size) => {
    // let cardData = JSON.parse(JSON.stringify(cartItems));

    if (!size) {
      toast.error("Select Product Size!");
      return;
    }

    // if(cardData[itemId]){
    //     if(cardData[itemId][size]){
    //         cardData[itemId][size] +=1;
    //     }
    //     else{
    //         cardData[itemId][size] = 1;
    //     }
    // }
    // else{
    //     cardData[itemId] = {};
    //     cardData[itemId][size] = 1;
    // }

    // setCartItems(cardData);

    setCartItems((prev) => {
      const updatedCart = { ...prev };

      if (updatedCart[itemId]) {
        updatedCart[itemId] = { ...updatedCart[itemId] };
        updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1;
      } else {
        updatedCart[itemId] = { [size]: 1 };
      }

      return updatedCart;
    });
  };

//   useEffect(() => {
//     console.log(cartItems);
//   }, [cartItems]);

  const getCartCount = () => {
    // let toalCount = 0;

    // for(const items in cartItems){
    //     for(const size in cartItems[items]){
    //         toalCount += cartItems[items][size]
    //     }
    // }

    if (!cartItems) return 0;
    return Object.values(cartItems).reduce(
      (total, sizes) => total + Object.values(sizes).reduce((a, b) => a + b, 0),
      0,
    );
  };

  const updateQuantity = async (itemId, size, quantity) => {
    setCartItems((prev)=>{
        const updatedCart = {...prev}

        if(updatedCart[itemId]){
            updatedCart[itemId] = {...updatedCart[itemId]}

            if(quantity <= 0){
                delete updatedCart[itemId][size];

                if(Object.keys(updatedCart[itemId]).length === 0){
                    delete updatedCart[itemId];
                }
            }
            else{
                updatedCart[itemId][size] = quantity
            }
        }

        return updatedCart;
    })
  }

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
