import React, { useState, useEffect } from 'react';
import Header from '../../components/Header.js';
import axiosInstance from '../../api/axiosInstance.js';
import { address } from '../../App.js';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../navigation/Routes.js';
import swal from 'sweetalert';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; // Import toastr CSS

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get(address("cart"));
      setCartItems(response.data.cart || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      toastr.error("Failed to load cart items. Please try again later.");
      setLoading(false);
    }
  };

  const handleQuantityChange = async (cartId, type) => {
    try {
      let response;
      if (type === 'increase') {
        response = await axiosInstance.put(address("incProdCount"), { cartId });
      } else {
        response = await axiosInstance.put(address("decProdCount"), { cartId });
      }
      if (response.status === 200) {
        toastr.success("Quantity updated successfully!");
        fetchCartItems(); // Re-fetch cart items to update the UI
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      toastr.error("Failed to update quantity. Please try again.");
    }
  };

  const handleRemoveItem = async (cartId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this item!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axiosInstance.delete(address("deleteProd"), { data: { cartId } });
          if (response.status === 200) {
            toastr.success("Item removed successfully!");
            fetchCartItems(); // Re-fetch cart items to update the UI
          }
        } catch (err) {
          console.error("Error removing item:", err);
          toastr.error("Failed to remove item. Please try again.");
        }
      }
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.product) {
        return total + item.product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mt-5 text-center">Loading cart...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2 className="mb-4">Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <div className="alert alert-info text-center">Your cart is empty.</div>
        ) : (
          <>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  if (!item.product) {
                    // Optionally, you can render a placeholder or a message for items with missing products
                    return (
                      <tr key={item._id}>
                        <td colSpan="5" className="text-center text-danger">
                          This product is no longer available.
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={item._id}>
                      <td>{item.product.name}</td>
                      <td>${item.product.price.toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-secondary mx-2"
                            onClick={() => handleQuantityChange(item._id, 'decrease')}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className='mx-2'>{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary mx-2"
                            onClick={() => handleQuantityChange(item._id, 'increase')}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="d-flex justify-content-end align-items-center mt-4">
              <h4 className="mx-3">Grand Total: ${calculateTotal().toFixed(2)}</h4>
              <button className="btn btn-primary btn-lg" onClick={()=>navigate(ROUTES.orderSummary.name)}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ShoppingCart;
