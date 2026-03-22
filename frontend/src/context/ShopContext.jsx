import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('')
  const navigate = useNavigate();

const addToCart = async (itemId, size) => {

  if (!size) {
    toast.error("Select Product Size!");
    return;
  }

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

  if (token) {
    try {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
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

    // call api to update cart
    if(token){
      try {
          await axios.post(`${backendUrl}/api/cart/update`,
          {itemId, size, quantity},
          {headers:{Authorization :`Bearer ${token}`}}
        )
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  }

  // function to get cart amount
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {

      const itemInfo = products.find((product) => product._id === itemId);

        if (!itemInfo) continue;

        for (const size in cartItems[itemId]) {
          totalAmount += itemInfo.price * cartItems[itemId][size];
      }
    }

    return totalAmount;
  }

  // fetching productss
  const getProductsData = async () => {
    try {
      const resp = await axios.get(`${backendUrl}/api/product/list`);
      if(resp.data.success){
        setProducts(resp.data.products);
      }
      else{
        toast.error(resp.data.message)
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  };

  // get user cart data
  const getUserCart = async (token) => {
      try {
        
        const response = await axios.post(`${backendUrl}/api/cart/get`, 
          {},
          {headers: {
            Authorization:`Bearer ${token}`
          }}
        )

        if(response.data.success){
          setCartItems(response.data.cartData)
        }

      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
  }

  // fetch token if present in local storage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getUserCart(storedToken)
    }
  }, []);

useEffect(() => {
  getProductsData();
}, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity, 
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
