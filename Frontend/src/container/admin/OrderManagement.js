import React, { useEffect, useState } from "react";
import Header from "../../components/Header.js";
import { address } from "../../App.js";
import axiosInstance from "../../api/axiosInstance.js";
import toastr from "toastr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    getOrders();
  }, []);

  function getOrders() {
    setLoading(true);
    try {
      // NOTE: agar backend route ka naam "getorders" / "orders" ho to yahan change karna
      axiosInstance
        .get(address("getrders"))
        .then((d) => {
          // Sort orders by orderDate in descending order (newest first)
          const sortedOrders = (d.data || []).sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          );
          setOrders(sortedOrders);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          toastr.error(error?.response?.data?.message || error.message);
          console.error(error);
        });
    } catch (error) {
      setLoading(false);
      toastr.error(error?.response?.data?.message || error.message);
      console.error(error);
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1); // Reset to first page on clear
  };

  // Helper: convert safely to lowercase string
  const toSafeLower = (value) =>
    (value ?? "").toString().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    const idStr = toSafeLower(order._id);
    const dateStr = toSafeLower(
      order.orderDate
        ? new Date(order.orderDate).toLocaleDateString()
        : ""
    );

    // total ko safe number bana ke string
    let totalStr = "";
    if (order.orderTotal !== undefined && order.orderTotal !== null) {
      const num = Number(order.orderTotal);
      if (!Number.isNaN(num)) {
        totalStr = num.toFixed(2).toLowerCase();
      }
    }

    const paymentStatusStr = toSafeLower(order.paymentStatus);
    const orderStatusStr = toSafeLower(order.orderStatus);
    const fullNameStr = toSafeLower(order.fullName);
    const addressStr = toSafeLower(order.address);
    const phoneStr = toSafeLower(order.phone);

    return (
      idStr.includes(searchLower) ||
      dateStr.includes(searchLower) ||
      totalStr.includes(searchLower) ||
      paymentStatusStr.includes(searchLower) ||
      orderStatusStr.includes(searchLower) ||
      fullNameStr.includes(searchLower) ||
      addressStr.includes(searchLower) ||
      phoneStr.includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${
            currentPage === i ? "active" : ""
          }`}
        >
          <button
            onClick={() => paginate(i)}
            className="page-link"
          >
            {i}
          </button>
        </li>
      );
    }
    return pageNumbers;
  };

  function renderOrders() {
    if (loading) {
      return (
        <tr>
          <td colSpan="9" className="text-center">
            Loading orders...
          </td>
        </tr>
      );
    }

    if (currentItems.length === 0) {
      return (
        <tr>
          <td colSpan="9" className="text-center">
            No orders found matching your search.
          </td>
        </tr>
      );
    }

    return currentItems.map((item) => {
      const totalNum =
        item.orderTotal !== undefined && item.orderTotal !== null
          ? Number(item.orderTotal)
          : 0;

      const totalDisplay = !Number.isNaN(totalNum)
        ? totalNum.toFixed(2)
        : "0.00";

      return (
        <tr key={item._id} className="text-center">
          <td>{item._id}</td>
          <td>
            {item.orderDate
              ? new Date(item.orderDate).toLocaleDateString()
              : "-"}
          </td>
          <td>₹{totalDisplay}</td>
          <td>{item.paymentStatus || "-"}</td>
          <td>{item.orderStatus || "-"}</td>
          <td>{item.fullName || "-"}</td>
          <td>{item.address || "-"}</td>
          <td>{item.phone || "-"}</td>
          <td>
            <button
              className="btn btn-sm btn-info"
              onClick={() => navigate(`/orders/${item._id}`)}
            >
              View Details
            </button>
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      <Header />
      <div className="container px-5 my-5">
        <h2 className="mb-4">Order Management</h2>

        <div className="row mb-3">
          <div className="col-md-6 offset-md-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="input-group-append">
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleClearSearch}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  disabled
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <table className="table table-striped table-hover table-bordered">
          <thead className="bg-secondary text-white">
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Total</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderOrders()}</tbody>
        </table>

        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${
                  currentPage === 1 ? "disabled" : ""
                }`}
              >
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className="page-link"
                >
                  Previous
                </button>
              </li>
              {renderPaginationButtons()}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className="page-link"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}

export default OrderManagement;
