/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance.js'; 
import { address } from '../../../App'; 
import ROUTES from '../../../navigation/Routes';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() =>
    new URLSearchParams(search),
    [search]
  );
}

function UserProductDetail() {
  const query = useQuery();
  const productId = query.get("id");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ product: productId, quantity: "1" });
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    } else {
      setError("Product ID not found in URL.");
      setLoading(false);
    }
  }, [productId]);

  const fetchProductDetails = async (id) => {
    try {
      const response = await axiosInstance.get(address(`product/${id}`)); // Use axiosInstance
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching product details:", err);
      toastr.error("Failed to load product details. Please try again later.");
      setError("Failed to load product details. Please try again later.");
      setLoading(false);
    }
  };

  const changehandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
      if(!token) {
        toastr.error("Please Login first, Redirecting...");
        setTimeout(() => {
          navigate(ROUTES.login.name); // Navigate to login or dashboard after successful login
        }, 2000);
        return
      }
    if (!form.quantity || parseInt(form.quantity) <= 0) {
      toastr.error("Please enter a valid quantity.");
      return;
    }
    if (parseInt(form.quantity) > product.quantity) {
      toastr.error(`Only ${product.quantity} items are available.`);
      return;
    }

    try {
      
      const response = await axiosInstance.post(address("addToCart"), {
        productId: form.product,
        quantity: parseInt(form.quantity),
      });

      if (response.status === 201) {
        window.dispatchEvent(new Event('cartUpdated'));
        toastr.success("Added to Cart")
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      const errorMessage = err.response?.data?.message || "Failed to add product to cart. Please try again.";
      toastr.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mt-4">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="container mt-4">
          <p className="text-danger">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <div className="container mt-4">
          <p>No product found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
              <ol className="carousel-indicators">
                {product.images.map((image, index) => (
                  <li
                    key={index}
                    data-target="#carouselExampleIndicators"
                    data-slide-to={index}
                    className={index === 0 ? "active" : ""}
                  ></li>
                ))}
              </ol>
              <div className="carousel-inner bg-dark rounded shadow">
                {product.images.map((image, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                    <img
                      className="d-block w-100"
                      src={address(image)}
                      alt={`Product image ${index + 1}`}
                      style={{ maxHeight: '400px', objectFit: 'contain' }}
                    />
                  </div>
                ))}
              </div>
              {product.images.length > 1 && (
                <>
                  <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                  </a>
                  <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <h2 className="mb-3">{product.name}</h2>
            <h4 className="text-primary mb-3">${product.price.toFixed(2)}</h4>
            <p className="text-muted">{product.description}</p>
            <p><strong>Quantity Available:</strong> {product.quantity}</p>

            <span>
              <label className='font-weight-bold'>Count</label>
              <div className='row mx-auto'>
                <input className='form-control col-4 ' value={form.quantity} onChange={changehandler} type='number' name='quantity' />
                <button className='btn btn-danger mx-2' onClick={() => setForm({ quantity: "1" })}>
                  <FontAwesomeIcon icon="rotate-left" />
                </button>
              </div>
            </span>
            {/* Add more product details here if needed */}
            <button className="btn btn-success mt-3" onClick={handleAddToCart}>Add to Cart</button>
            <button className='btn btn-info mt-3 mx-2' onClick={() => { navigate(ROUTES.productUser.name + "?id=" + product.department._id) }}>Back to View</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProductDetail;
