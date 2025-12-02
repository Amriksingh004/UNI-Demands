/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect } from "react";
import Header from "../../components/Header.js";
import { useState } from "react";
import axios from "../../api/axiosInstance.js";
import { address } from "../../App.js";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../navigation/Routes.js";
import $ from 'jquery';

function Home() {
  const [universities, setUniversities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    GetUniversities();
  }, []);

  useEffect(() => {
    if (universities.length > 0) {
      // Destroy existing DataTable instance if it exists
      if ($.fn.DataTable.isDataTable('#universityTable')) {
        $('#universityTable').DataTable().destroy();
      }

      $('#universityTable').DataTable({
        data: universities,
        columns: [
          {
            render: function (data, type, row) {
              return `
                <div class="px-4 mb-4">
                  <div class="card shadow-lg rounded text-center" style="width: 18rem; min-height: 12rem;">
                    <img class="card-img-top" alt="Card image cap" src="${address(row.image)}" style="height: 250px; object-fit: cover;" />
                    <div class="card-body d-flex flex-column justify-content-between">
                      <h5 class="card-title font-weight-bold">${row.name}</h5>
                      <button
                        class="btn btn-primary mt-auto go-to-departments-btn"
                        data-id="${row._id}"
                        data-name="${row.name}"
                      >
                        Go to Departments
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }
          }
        ],
        destroy: true, // Ensure DataTable is destroyed and reinitialized
      });

      // Add event listener for the dynamically created buttons
      $('#universityTable tbody').off('click', '.go-to-departments-btn').on('click', '.go-to-departments-btn', function () {
        const id = $(this).data('id');
        const name = $(this).data('name');
        navigate(ROUTES.departmentUser.name + "?id=" + id + "&name=" + name);
      });
    } else if ($.fn.DataTable.isDataTable('#universityTable')) {
      // If no universities and DataTable exists, destroy it to show "No items available" message
      $('#universityTable').DataTable().destroy();
    }
  }, [universities, navigate]);

  function GetUniversities() {
    try {
      axios
        .get(address("university"))
        .then((d) => {
          setUniversities(d.data.uniData);
        })
        .catch((err) => alert(err.message));
    } catch (error) {
      alert("Something glitched");
    }
  }

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2 className="mb-4">All Universities</h2>
        {universities.length === 0 ? (
          <div className="alert alert-info text-center">No Universities available.</div>
        ) : (
          <table id="universityTable" className="display" style={{ width: "100%" }}>
            <thead>
              <tr>
                {/* DataTable will manage headers */}
              </tr>
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

export default Home;
