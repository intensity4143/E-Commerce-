import React, { useContext, useState } from "react";
import Title from "../components/Title";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import CartTotal from "../components/CartTotal";
import { assets} from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    products,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // to set value of different fields of formData
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let orderItems = [];
      
      for (const item in cartItems) {
        for (const size in cartItems[item]) {
          const prodctInfo = structuredClone( products.find((product) => product._id === item));
          
          if (prodctInfo) {
            prodctInfo.size = size
            prodctInfo.quantity = cartItems[item][size]
            orderItems.push(prodctInfo)
          }
        }
      }
      
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }
      
      // switch case to call for different order api based on payment method
      switch(paymentMethod){

        // API call for COD
        case 'cod':
            const response = await axios.post(`${backendUrl}/api/order/place`, 
              orderData,
              {
                headers: {
                  Authorization :`Bearer ${token}`
                }
              }
            )

            // if order placed successfully then -> empty carts and navigate to orders page
            if(response.data.success){
              console.log(response.data)
              setCartItems({})
              navigate('/orders')
            }
            else{
              toast.error(response.data.message)
            }
            break;

        // case for stipe payment method
        case 'stripe' :
            const responseStripe = await axios.post(`${backendUrl}/api/order/stripe`,
              orderData,
              {
                headers:{
                  Authorization: `Bearer ${token}`
                }
              }
            )  
            
            if(responseStripe.data.success){
              const {session_url} = responseStripe.data
              window.location.replace(session_url)  // navigate to stripe payment gateway for pament
            }
            else{
              toast.error(responseStripe.data.message)
            }
            break;

        // razorpay payment
        case "razorpay":
            const responseRazorpay = await axios.post(`${backendUrl}/api/order/razorpay`,
              orderData,
              {
                headers:{
                  Authorization:`Bearer ${token}`
                }
              }
            )

            if(responseRazorpay.data.success){
              console.log(responseRazorpay.data.order)
            }

            break;
        

        default:
          break;
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* left side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVER"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            required
            type="text"
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            required
            type="text"
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          required
          type="email"
          placeholder="Email Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          required
          type="text"
          placeholder="Sreet Name"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />

        {/* city and state  */}
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            required
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            required
            type="text"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        {/* pin code and country */}
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            required
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="Pin Code"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            required
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <PhoneInput
          country={"in"}
          enableSearch
          value={formData.phone}
          required
          onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
        />
      </div>
      {/* Right side */}
      required
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        {/* payment */}
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHODS"} />
          {/* payment methods selections */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setPaymentMethod("stripe")}
              className=" flex items-center gap-3 border p-2 px-3 cursor-pointer border-gray-400"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === "stripe" ? "bg-green-400" : ""}`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div
              onClick={() => setPaymentMethod("razorpay")}
              className=" flex items-center gap-3 border p-2 px-3 cursor-pointer border-gray-400"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === "razorpay" ? "bg-green-400" : ""}`}
              ></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>
            <div
              onClick={() => setPaymentMethod("cod")}
              className=" flex items-center gap-3 border border-gray-400 p-2 px-3 cursor-pointer "
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === "cod" ? "bg-green-400" : ""}`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
