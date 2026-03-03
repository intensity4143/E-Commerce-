import React, { useContext, useState } from "react";
import Title from "../components/Title";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const {navigate} = useContext(ShopContext)

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">

      {/* left side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVER"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          type="email"
          placeholder="Email address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          type="email"
          placeholder="Sreet Name"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />

        {/* city and state  */}
        <div className="flex gap-3">
          <input
            type="email"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="email"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        {/* pin code and country */}
        <div className="flex gap-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="Pin Code"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="email"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <PhoneInput
          country={"in"}
          enableSearch
          value={phone}
          onChange={setPhone}
        />
      </div>

      {/* Right side */}

      <div className="mt-8">

        <div className="mt-8 min-w-80">
          <CartTotal/>
        </div>

        {/* payment */}
        <div className = 'mt-12'>
          <Title text1={'PAYMENT'}  text2={'METHODS'} />
          {/* payment methods selections */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={()=> setPaymentMethod('stripe')} 
             className=" flex items-center gap-3 border p-2 px-3 cursor-pointer border-gray-400">

              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />

            </div>
            <div
              onClick={()=> setPaymentMethod('razorpay')} 
             className=" flex items-center gap-3 border p-2 px-3 cursor-pointer border-gray-400">

              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />

            </div>
            <div
              onClick={()=> setPaymentMethod('cod')} 
             className=" flex items-center gap-3 border border-gray-400 p-2 px-3 cursor-pointer ">

              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>

            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button onClick={()=> navigate('/orders')} 
              className="bg-black text-white px-16 py-3 text-sm">
              PLACE ORDER
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PlaceOrder;
