import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import $ from "jquery";
import { address } from "../../../App";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTES from "../../../navigation/Routes";
import axios from "../../../api/axiosInstance.js"; // Use axiosInstance

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() =>
    new URLSearchParams(search),
    [search]
  );
}

function UserProduct() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const query = useQuery();
  const departmentName = query.get("name"); // Get department name from query
  const departmentId = query.get("id"); // Get department ID from query

  useEffect(() => {
    GetProducts();
  }, [departmentId]); // Depend on departmentId to refetch if it changes

  const GetProducts = () => {
    axios.get(address(`products/${departmentId}`)).then((d) => {
      setProducts(d.data);
    }).catch((er) => {
      console.error("Error fetching products:", er);
      setProducts([]); // Set to empty array on error
    });
  }

  useEffect(() => {
    if (products.length > 0) {
      // Destroy existing DataTable instance if it exists
      if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
      }

      $("#dataTable").DataTable({
        data: products,
        columns: [
          {
            render: function (data, type, row) {
              return `
                  <div class="px-4 mb-4">
                    <div class="card shadow-lg rounded text-center" style="width: 18rem;border:0.5px solid rgb(90, 90, 90)">
                      <img class="card-img-top" alt="Card image cap" src="${address(
                        row.images[0]
                      )}" style="height: 250px; object-fit: cover;" />
                      <div class="card-body d-flex flex-column justify-content-between">
                      <div class="row align-items-start ">
                        <h5 class="card-title font-weight-bold text-left   col-8">${row.name}</h5>
                        <span class="col-4 font-weight-bold rounded text-white bg-success">$${row.price}</span>
                        <p class="mx-3 text-left alert-secondary border form-control" >${row.description}</p>
                      </div>
                        
                        <div class="flex">
                        <button
                          class="btn btn-primary mt-auto go-to-products-btn"
                          data-id="${row._id}"
                        >
                          Details
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
            },
          },
        ],
        destroy: true, // Destroy existing table if any
      });

      // Add event listener for the dynamically created buttons
      $("#dataTable tbody").off("click", ".go-to-products-btn").on("click", ".go-to-products-btn", function () {
        const id = $(this).data("id");
        navigate(ROUTES.productDetail.name + "?id=" + id ,{state:{departmentId:query.get("id")}});
      });
    } else if ($.fn.DataTable.isDataTable('#dataTable')) {
      // If no products and DataTable exists, destroy it to show "No items available" message
      $('#dataTable').DataTable().destroy();
    }
  }, [products, navigate]);

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2 className="mb-4">Products in {departmentName}</h2>
        {products.length === 0 ? (
          <div className="alert alert-info text-center">No products available in this Store.</div>
        ) : (
          <table
            id="dataTable"
            className="display"
            style={{ width: "100%" }}
          >
            <thead>
              <tr></tr>
            </thead>
            <tbody className="d-flex">
              {/* DataTables will populate this tbody */}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserProduct;
