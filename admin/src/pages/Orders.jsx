import { useState } from "react";
import { backendUrl } from "../App";
import { useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  // function to fetch all products
  const fetchAllOrders = async () => {
    if (!token) {
      toast.error("Please login again!");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if(response.data.success){
        setOrders(response.data.orders)
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(()=>{
    fetchAllOrders();
  }, [token])

  return (
      <div>

      </div>
  );
};

export default Orders;
