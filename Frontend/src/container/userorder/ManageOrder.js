import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { address } from "../../App";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const res = await axios.get(address(`api/orders/user/${userId}`));
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = async (orderId, itemId) => {
    try {
      const productId = orders
        .find((o) => o._id === orderId)
        ?.items.find((i) => i._id === itemId)?.product._id;

      if (!productId) {
        alert("Product not found");
        return;
      }

      const res = await axios.post(
        address(`api/orders/replacement/request`),
        { orderId, productId, reason: "Product replacement requested" }
      );
      alert(res.data.message);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Error sending replacement request");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-2">
              Order ID: {order._id}
            </h2>
            <p className="text-sm text-gray-600">
              Date: {new Date(order.orderDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Total: ₹{order.totalAmount}
            </p>
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Item</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item._id}>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">₹{item.price}</td>
                    <td className="border p-2 text-center">
                      {item.replaceRequested ? (
                        <span className="text-green-600 font-medium">
                          Requested
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            handleReplace(order._id, item._id)
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Request Replace
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageOrder;
