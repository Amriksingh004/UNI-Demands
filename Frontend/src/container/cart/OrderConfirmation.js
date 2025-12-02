import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header.js';
import axiosInstance from '../../api/axiosInstance.js';
import { address } from '../../App.js';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import ROUTES from '../../navigation/Routes.js';

function OrderConfirmation() {
  const [message, setMessage] = useState('Verifying your payment...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('session_id');

    if (sessionId) {
      axiosInstance.get(address(`orderconfirmation?session_id=${sessionId}`))
        .then(response => {
          setMessage('Order placed successfully! Thank you for your purchase.');
          toastr.success('Order confirmed!');
          setTimeout(() => {
            navigate(ROUTES.home.name);
          }, 5000); // Redirect to home after 5 seconds
        })
        .catch(error => {
          console.error("Order confirmation error:", error);
          setMessage('There was an issue with your order confirmation. Please contact support.');
          toastr.error('Order confirmation failed.');
        });
    } else {
        setMessage('Invalid session. No payment to confirm.');
        toastr.error('Invalid session ID.');
    }
  }, [location, navigate]);

  return (
    <div>
      <Header />
      <div className="container mt-5 text-center">
        <h2>Order Status</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default OrderConfirmation;