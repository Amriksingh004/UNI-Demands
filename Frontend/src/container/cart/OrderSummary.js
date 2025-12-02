import React, { useState, useEffect } from 'react';
import Header from '../../components/Header.js';
import axiosInstance from '../../api/axiosInstance.js';
import { address } from '../../App.js';
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import ROUTES from '../../navigation/Routes.js';

function OrderSummary() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderSummary();
  }, []);

  const fetchOrderSummary = async () => {
    try {
      const response = await axiosInstance.get(address('ordersummary'));
      setCartItems(response.data.cartItems || []);
      setTotal(response.data.total || 0);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching order summary:", err);
      toastr.error("Failed to load order summary.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(address('ordersubmission'), {
        ...formData,
        successUrl: `http://localhost:3000${ROUTES.orderConfirmation.name}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: 'http://localhost:3000'+ROUTES.orderSummary.name,
      });
      if (response.data.sessionId) {
        const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      } else {
        toastr.success("Order placed successfully!");
        navigate(ROUTES.home.name);
      }
    } catch (err) {
      console.error("Detailed error placing order:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        toastr.error(err.response.data.message || "Failed to place order. Please check your details.");
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Error request:", err.request);
        toastr.error("Could not connect to the server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        toastr.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mt-5 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2>Order Summary</h2>
        <div className="row">
          <div className="col-md-7">
            <h4>Shipping Details</h4>
            <form onSubmit={handlePlaceOrder}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Place Order</button>
            </form>
          </div>
          <div className="col-md-5">
            <h4>Cart Summary</h4>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li key={item._id} className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">{item.product.name}</h6>
                    <small className="text-muted">Quantity: {item.quantity}</small>
                  </div>
                  <span className="text-muted">${(item.product.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (USD)</span>
                <strong>${total.toFixed(2)}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
