import React, { useState } from 'react';
import Header from '../../components/Header.js';
import axios from 'axios';
import { address } from '../../App.js';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../navigation/Routes.js';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Clear previous messages

    try {
      const response = await axios.post(address("user/login"), {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        localStorage.setItem('userData', JSON.stringify(response.data.userInDb));
        localStorage.setItem('token', response.data.token);
        setMessage({ type: 'success', text: response.data.message || 'Login successful!' });
        setTimeout(() => {
          navigate(ROUTES.home.name); // Navigate to home or dashboard after successful login
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong during login.';
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
                <h3>Login</h3>
              </div>
              <div className="card-body">
                {message.text && (
                  <div className={`alert alert-${message.type}`}>
                    {message.text}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
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
                  <button type="submit" className="btn btn-primary w-100">
                    Login
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

export default Login;
