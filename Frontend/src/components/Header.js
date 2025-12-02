/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ROUTES from "../navigation/Routes";
import axiosInstance from "../api/axiosInstance.js";
import { address } from "../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
          getCartCount()

      setIsLoggedIn(true);
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsLoggedIn(false);
        setIsAdmin(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }

    const handleCartUpdate = () => getCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate(ROUTES.login.name);
  };


  const getCartCount = () => {
    axiosInstance.get(address("cart")).then((d) => {
      setCartCount(d.data.cart.length) ;
    }).catch(()=>setCartCount(0));

  };

  return (
    <div style={{ margin: "0 0 3rem  0" }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">
        UNi Demands
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            {isAdmin ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/universityAdmin">
                    University Management
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/orderManagement">
                    Order Management
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">
                    Contact
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/userorder">
                    ManageOrder
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/support">
                    Support
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" style={{position:"relative"}} to={ROUTES.cart.name}>
                <FontAwesomeIcon icon="cart-shopping" />
                <span className="rounded-pill bg-danger text-white" style={{padding:"0 4px",fontSize:"0.7em", position:"absolute", right:"2px", top:"1px"}}>{cartCount}</span>
              </Link>
            </li>
          </ul>
          <span className="navbar-text d-flex">
            {!isLoggedIn && (
              <>
                <span className="nav-item mx-1">
                  <Link
                    className="nav-link btn btn-info text-white btn-sm"
                    to="/register"
                  >
                    Register
                  </Link>
                </span>
                <span className="nav-item mx-1">
                  <Link
                    className="nav-link btn btn-success text-white btn-sm"
                    to="/login"
                  >
                    Login
                  </Link>
                </span>
              </>
            )}

            {isLoggedIn && (
              <span className="nav-item mx-1">
                <button
                  className="nav-link btn btn-info text-white btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </span>
            )}
          </span>
        </div>
      </nav>
    </div>
  );
}

export default Header;
