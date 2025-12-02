import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import axiosInstance from "../../api/axiosInstance";
import { address } from "../../App";
import toastr from "toastr";

function OrderDetails() {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [availableProducts, setAvailableProducts] = useState({}); // { replacementId: [products] }

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await axiosInstance.get(address(`orders/${orderId}`));
      setOrderData(res.data);
    } catch (err) {
      console.error(err);
      toastr.error("Failed to fetch order");
    }
  };

  // Request replacement
  const handleReplace = async (productId) => {
    const reason = prompt("Enter reason for replacement:");
    if (!reason) return;

    try {
      await axiosInstance.post(address("orders/replacement/request"), {
        orderId,
        productId,
        reason,
      });
      toastr.success("Replacement requested!");
      fetchOrder();
    } catch (err) {
      console.error(err);
      toastr.error("Failed to request replacement");
    }
  };

  // Fetch products for replacement for a specific replacement request
  const fetchReplacementProducts = async (replacement) => {
    try {
      const deptId = replacement.product.department._id;
      const res = await axiosInstance.get(address(`products?department=${deptId}`));
      setAvailableProducts(prev => ({ ...prev, [replacement._id]: res.data }));
    } catch (err) {
      console.error(err);
      toastr.error("Failed to fetch replacement products");
    }
  };

  // Select new product and replace in the order
  const handleSelectNewProduct = async (replacementId, productId) => {
    try {
      await axiosInstance.post(
        address(`orders/replacement/${replacementId}/select-new`),
        { newProductId: productId }
      );
      toastr.success("Replacement completed!");
      fetchOrder();
    } catch (err) {
      console.error(err);
      toastr.error("Failed to replace product");
    }
  };

  if (!orderData) return <div><Header /><div className="container mt-5">Loading...</div></div>;

  const { order, items, replacements } = orderData;

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2>Order #{order._id}</h2>
        <p><strong>Status:</strong> {order.orderStatus}</p>

        <h4>Items</h4>
        <ul className="list-group mb-4">
          {items.map(it => (
            <li key={it._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>{it.product?.name} (Qty: {it.quantity})</div>
              <div>
                ${it.price * it.quantity}{" "}
                <button
                  className="btn btn-warning btn-sm ms-3"
                  onClick={() => handleReplace(it.product._id)}
                >
                  Replace
                </button>
              </div>
            </li>
          ))}
        </ul>

        <h4>Replacement Requests</h4>
        <ul className="list-group">
          {replacements.map(r => (
            <li key={r._id} className="list-group-item">
              <div><strong>Product:</strong> {r.product?.name}</div>
              <div><strong>Reason:</strong> {r.reason}</div>
              <div><strong>Status:</strong> {r.status}</div>

              {r.newProduct ? (
                <div><strong>Selected New Product:</strong> {r.newProduct.name}</div>
              ) : r.status === "Pending" ? (
                <>
                  <button
                    className="btn btn-info mt-2"
                    onClick={() => fetchReplacementProducts(r)}
                  >
                    Select New Product
                  </button>

                  {availableProducts[r._id] && (
                    <div className="mt-2">
                      {availableProducts[r._id].map(p => (
                        <button
                          key={p._id}
                          className="btn btn-outline-success btn-sm me-2 mb-2"
                          onClick={() => handleSelectNewProduct(r._id, p._id)}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrderDetails;
