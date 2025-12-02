import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../components/Header.js'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../../api/axiosInstance.js';
import { address } from '../../App.js';
import toastr from 'toastr'
import swal from 'sweetalert'
import ROUTES from '../../navigation/Routes.js';

function useQuery(){
  const {search} = useLocation();
  return useMemo(()=>
    new URLSearchParams(search),[search]
  );
}

function Department() {
  
  const query = useQuery();
  const [departments, setDepartments] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [form, setForm] = useState({name:"",image:null, universityId:query.get("id")});
  const [formError, setFormError] = useState({name:"",image:""});
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  
  useEffect(() => {
    getDepartments();

  }, []);

  function getDepartments() {
    try {
      axios.get(address(`department/${query.get("id")}`)).then((d) => {
        setDepartments(d.data);
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
      error={...error,name:"Department name must be there"}
    }
    if(form.image == null && !departmentId){
      errors = true;
      error={...error,image:"Image Must be uploaded"}
    }
    setFormError(error);
    
    if(!errors)
    departmentId ? updateDepartment() : saveDepartments();
  }

  function saveDepartments() {
    try {
      let formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      formData.append("universityId",query.get("id"))
      axios
        .post(address("department"), formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          toastr.success(d.data.message);
          getDepartments();
          resetForm();
        });
    } catch (error) {
      toastr.error(error.message);
      console.error(error);
    }
  }

  function updateDepartment() {
    try {
      axios
        .putForm(address("department"), {
          name: form.name,
          image: form.image,
          id: departmentId,
        })
        .then((d) => {
          toastr.success(d.data.message);
          getDepartments();
          resetForm();
        });
    } catch (error) {
      toastr.error(error?.message);
    }
  }

  function deleteDepartment(id) {
    try {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios.delete(address(`department/${id}`)).then((d) => {
            toastr.success(d.data.message);
            getDepartments();
          });
        } else {
          swal("Your record is safe!");
        }
      });
    } catch (error) {
      toastr.error(error?.message)
    }
  }

function renderDepartments() {
    return departments?.map((item) => {
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
                navigate(ROUTES.productAdmin.name+"?id="+item._id + "&name="+item.name)
              }}
            >Add Product</button>
          </td>
          <td>
            <button
              className="btn btn-success"
              onClick={() => {
                setDepartmentId(item._id);
                setForm({ ...form, name: item.name });
                setPreview(address(item.image));
              }}
            >
              <i className="fa fa-edit"></i>Edit
            </button>
          </td>
          <td>
            <button className="btn btn-danger"
            onClick={()=>{deleteDepartment(item._id)}}>
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
              <b className="">{departmentId?"Update Department":"Add Department"}</b>
            </div>
            <div className="card-body">
              <div className='form-group row'>
                <label className='font-weight-bold'>University Name</label>
                <b className='form-control'>{query.get("name")}</b>
              </div>
              <div className="form-group row">
                <label className="font-weight-bold ">Department Name</label>
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
                <label className="font-weight-bold ">Department Image</label>
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
                {departmentId?"Update":"Save"}
              </button>
              <button
                className="btn btn-danger mx-2"
                onClick={() => {
                  resetForm();
                  setDepartmentId(null)
                  setPreview(null);
                }}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="text-center mx-auto">
            <img
              id="depImage"
              src={preview}
              className="col-6 cover image-fluid"
            />
          </div>
        </div>

      <div className="px-5 my-5">
        <table className="table table-striped  table-hover table-bordered">
          <thead className="bg-secondary text-white">
            <tr>
              <th>Department Image</th>
              <th> Department Name</th>
              <th>Add Product</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{renderDepartments()}</tbody>
        </table>
      </div>
    </>
  );
  
}

export default Department