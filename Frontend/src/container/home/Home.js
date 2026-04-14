/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect } from "react";
import Header from "../../components/Header.js";
import { useState } from "react";
import axios from "../../api/axiosInstance.js";
import { address } from "../../App.js";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../navigation/Routes.js";

function Home() {
  const [universities, setUniversities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    GetUniversities();
  }, []);

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

  const handleGoToDepartments = (id, name) => {
    navigate(ROUTES.departmentUser.name + "?id=" + id + "&name=" + name);
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2 className="mb-4">All Universities</h2>
        {universities.length === 0 ? (
          <div className="alert alert-info text-center">No Universities available.</div>
        ) : (
          <div className="row">
            {universities.map((uni) => (
              <div key={uni._id} className="col-md-4 col-sm-6 col-12 mb-4">
                <div className="card shadow-lg rounded text-center h-100">
                  <img
                    className="card-img-top"
                    alt={uni.name}
                    src={address(uni.image)}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title font-weight-bold">{uni.name}</h5>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() => handleGoToDepartments(uni._id, uni.name)}
                    >
                      Go to Departments
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
