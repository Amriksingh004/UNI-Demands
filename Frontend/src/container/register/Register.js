import React, { useState } from 'react';
import Header from '../../components/Header.js';
import axios from 'axios';
import { address } from '../../App.js';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../navigation/Routes.js';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Clear previous messages

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'danger', text: 'Passwords do not match!' });
      return;
    }

    try {
      const response = await axios.post(address("user/register"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (response.status === 201) {
        localStorage.setItem('userData', JSON.stringify(response.data.userData));
        localStorage.setItem('token', response.data.token);
        setMessage({ type: 'success', text: response.data.message || 'Registration successful!' });
        setTimeout(() => {
          navigate(ROUTES.home.name);
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong during registration.';
      setMessage({ type: 'danger', text: errorMessage });
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg rounded">
              <div className="card-header text-center bg-primary text-white">
                <h3>Register</h3>
              </div>
              <div className="card-body">
                {message.text && (
                  <div className={`alert alert-${message.type}`}>
                    {message.text}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="email">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
