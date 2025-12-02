/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import Header from "../../components/Header.js";
import { useNavigate } from "react-router-dom";
import { address } from "../../App.js";
import axiosInstance from "../../api/axiosInstance.js"; // Use the configured axios instance
import toastr from "toastr";
import swal from "sweetalert";
import ROUTES from "../../navigation/Routes.js";

function University() {
  const [universities, setUniversities] = useState(null);
  const [universityId, setUniversityId] = useState(null);
  const [form, setForm] = useState({ name: "", image: null });
  const [formError, setFormError] = useState({ name: "", image: "" });
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    getUniversities();
  }, []);

  function getUniversities() {
    try {
      axiosInstance.get(address("university")).then((d) => {
        setUniversities(d.data.uniData);
      });
    } catch (error) {
      alert(error.message);
    }
  }

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const imagehandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm((prevForm) => ({
        ...prevForm,
        image: file, // This is the crucial change
      }));
    } else {
      // Handle case where file is deselected
      setPreview(null);
      setForm((prevForm) => ({
        ...prevForm,
        image: null,
      }));
    }
  };

  function resetForm() {
    setForm({ name: "", image: null });
  }

  function handleClick() {
    let errors = false;
    let error= {name:"", image:""}
    if(form.name.trim().length === 0){
      errors = true;
      error={...error,name:"University name must be there"}
    }
    if(form.image == null && !universityId){
      errors = true;
      error={...error,image:"Image Must be uploaded"}
    }
    setFormError(error);
    
    if(!errors)
    universityId ? updateUniversity() : saveUniversities();
  }

  function saveUniversities() {
    try {
      let formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      axiosInstance
        .post(address("university"), formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          toastr.success(d.data.message);
          getUniversities();
          resetForm();
        });
    } catch (error) {
      toastr.error(error.message);
      console.error(error);
    }
  }

  function updateUniversity() {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      if (form.image) {
        formData.append("image", form.image);
      }
      formData.append("id", universityId);

      axiosInstance
        .put(address("university"), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((d) => {
          toastr.success(d.data.message);
          getUniversities();
          resetForm();
          setUniversityId(null);
          setPreview(null);
        });
    } catch (error) {
      toastr.error(error?.response?.data?.message || error.message);
    }
  }

  function deleteUniversity(id) {
    try {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axiosInstance.delete(address(`university/${id}`)).then((d) => {
            toastr.success(d.data.message);
            getUniversities();
          });
        } else {
          swal("Your record is safe!");
        }
      });
    } catch (error) {
      toastr.error(error?.message)
    }
  }

  function renderUniversities() {
    return universities?.map((item) => {
      return (
        <tr className="text-center">
          <td>
            <img
              src={address(item.image)}
              className="image-fluid img-thumbnail"
              width={100}
            />
          </td>
          <td>{item.name}</td>
          <td>
            <button className="btn btn-primary"
              onClick={()=>{
                navigate(ROUTES.departmentAdmin.name+"?id="+item._id + "&name="+item.name)
              }}
            >Add Department</button>
          </td>
          <td>
            <button
              className="btn btn-success"
              onClick={() => {
                setUniversityId(item._id);
                setForm({ ...form, name: item.name });
                setPreview(address(item.image));
              }}
            >
              <i className="fa fa-edit"></i>Edit
            </button>
          </td>
          <td>
            <button className="btn btn-danger"
            onClick={()=>{deleteUniversity(item._id)}}>
              <i className="fa fa-trash"></i>Delete
            </button>
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      <Header />
      
        <div className="bg-light d-flex">
          <div className="card shadow col-4 offset-1">
            <div className="card-header bg-secondary text-white">
              <b className="">{universityId?"Update University":"Add University"}</b>
            </div>
            <div className="card-body">
              <div className="form-group row">
                <label className="font-weight-bold ">University Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  onChange={changeHandler}
                  value={form.name}
                />
                <p className="text-danger">{formError.name}</p>
              </div>

              <div className="form-group row">
                <label className="font-weight-bold ">University Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={(e) => {
                    imagehandler(e);
                  }}
                />
                <p className="text-danger">{formError.image}</p>
              </div>
            </div>
            <div className="card-footer text-right">
              <button
                className="btn btn-info"
                onClick={() => {
                  handleClick();
                }}
              >
                {universityId?"Update":"Save"}
              </button>
              <button
                className="btn btn-danger mx-2"
                onClick={() => {
                  resetForm();
                  setUniversityId(null)
                  setPreview(null);
                }}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="text-center mx-auto">
            <img
              id="univImage"
              src={preview}
              className="col-6 cover image-fluid"
            />
          </div>
        </div>

      <div className="px-5 my-5">
        <table className="table table-striped  table-hover table-bordered">
          <thead className="bg-secondary text-white">
            <tr>
              <th>University Image</th>
              <th>University Name</th>
              <th>Add Department</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{renderUniversities()}</tbody>
        </table>
      </div>
    </>
  );
}

export default University;
