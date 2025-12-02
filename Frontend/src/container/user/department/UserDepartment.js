import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import axios from "../../../api/axiosInstance.js"; // Use axiosInstance
import { address } from "../../../App";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTES from "../../../navigation/Routes";
import $ from "jquery";
import 'datatables.net-dt'; // Ensure DataTable CSS is included if needed

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function UserDepartment() {
  const [departments, setDepartments] = useState([]);
  const query = useQuery();
  const universityName = query.get("name"); // Get university name from query
  const universityId = query.get("id"); // Get university ID from query

  const navigate = useNavigate();

  useEffect(() => {
    GetDepartments();
  }, [universityId]); // Depend on universityId to refetch if it changes

  const GetDepartments = () => {
    axios.get(address("department/" + universityId)).then((d) => {
      setDepartments(d.data);
    }).catch(error => {
      console.error("Error fetching departments:", error);
      setDepartments([]); // Set to empty array on error
    });
  };

  useEffect(() => {
    if (departments.length > 0) {
      // Destroy existing DataTable instance if it exists
      if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
      }

      $("#dataTable").DataTable({
        data: departments,
        columns: [
          {
            render: function (data, type, row) {
              return `
                <div class="px-4 mb-4">
                  <div class="card shadow-lg rounded text-center" style="width: 18rem; min-height: 12rem;">
                    <img class="card-img-top" alt="Card image cap" src="${address(
                      row.image
                    )}" style="height: 250px; object-fit: cover;" />
                    <div class="card-body d-flex flex-column justify-content-between">
                      <h5 class="card-title font-weight-bold">${row.name}</h5>
                      <button
                        class="btn btn-primary mt-auto go-to-products-btn"
                        data-id="${row._id}"
                        data-name="${row.name}"
                      >
                        Go to Products
                      </button>
                    </div>
                  </div>
                </div>
              `;
            },
          },
        ],
        destroy: true, // Ensure DataTable is destroyed and reinitialized
      });

      // Add event listener for the dynamically created buttons
      $('#dataTable tbody').off('click', '.go-to-products-btn').on(
        "click",
        ".go-to-products-btn",
        function () {
          const id = $(this).data("id");
          const name = $(this).data("name");
          navigate(ROUTES.productUser.name + "?id=" + id + "&name=" + name);
        }
      );
    } else if ($.fn.DataTable.isDataTable('#dataTable')) {
      // If no departments and DataTable exists, destroy it to show "No items available" message
      $('#dataTable').DataTable().destroy();
    }
  }, [departments, navigate]);

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2 className="mb-4">Store for {universityName}</h2>
        {departments.length === 0 ? (
          <div className="alert alert-info text-center">No sections available for this store.</div>
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

export default UserDepartment;
