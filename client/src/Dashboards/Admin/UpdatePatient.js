import Sidebar from "../../Components/AdminSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ✅ Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Firstname is required!").matches(/^\S+$/, "Firstname cannot contain spaces!"),
  lastname: yup.string().required("Lastname is required!").matches(/^\S+$/, "Lastname cannot contain spaces!"),
  phoneNumber: yup.string()
    .required('Phone number is required!')
    .matches(/^\+?(\d{1,4})?[\s\(\)-]?\(?\d{1,4}\)?[\s\(\)-]?\d{1,4}[\s\(\)-]?\d{1,4}$|^0\d{8,12}$/, "Phone number must be valid")
    .min(8).max(15),
  email: yup.string().email("Invalid email").required("Email is required!"),
  birth: yup.string()
    .required("Date is required!")
    .test('max-date', 'Date cannot be in the future!', (value) => {
      const parsed = new Date(value);
      return parsed <= new Date();
    }),
    photo: yup.mixed().notRequired(), 
});

function UpdatePatient() {
  const { id } = useParams(); // ✅ Get patient ID from URL
  const navigate = useNavigate();

  useEffect(() => {
  axios
    .get(`http://localhost:3001/updatePatient/${id}`, {
      withCredentials: true, // this sends the JWT cookie
    })
    .then((res) => {
      if (res.data.user?.role !== 'admin') {
        // Not a patient? Block it.
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'Only admin can access this page.',
        });
        navigate('/');
      }
    })
    .catch((err) => {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
         Swal.fire({
                                  icon: "error",
                                  title: "Access Denied",
                                  text: "Please login.",
                                  confirmButtonColor: "#51A485",
                                });
        navigate('/');
      } else {
        console.error("Unexpected error", err);
      }
    });
}, [id]);

  const [info, setInfo] = useState(null);
  const [gender, setGender] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    axios.get(`http://localhost:3001/patient/patientInfoForUpdation/${id}`, {
      withCredentials: true,
    })
    .then((res) => {
        console.log(res.data);
      const patient = res.data[0];
      setInfo(patient);
    }).catch(err=>{
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
         Swal.fire({
                                  icon: "error",
                                  title: "Access Denied",
                                  text: "Please login.",
                                  confirmButtonColor: "#51A485",
                                });
        navigate('/');
      } else {
        console.error("Unexpected error", err);
      };
    });
  }, [id]);

  // ✅ Reset form with fetched data
  useEffect(() => {
    if (info) {
     
      reset({
        name: info.first_name,
        lastname: info.last_name,
        phoneNumber: info.phone,
        email: info.email,
        birth: info.date_of_birth,
        gender: info.gender_id,
      });
    }
  }, [info, reset]);

  // ✅ Get gender and blood type options
  useEffect(() => {
    axios.get('http://localhost:3001/api/gender').then((res) => setGender(res.data));
  }, []);

  // ✅ Submit form
  const formSubmit = (data) => {
      const formData = new FormData();
    formData.append("first_name", data.name);
    formData.append("last_name", data.lastname);
    formData.append("phone", data.phoneNumber);
    formData.append("email", data.email);
    formData.append("date_of_birth", data.birth);
    formData.append("gender_name", data.gender);

    const fileInput = getValues("photo"); // get the File from file input
    if (fileInput && fileInput[0]) {
      formData.append("image", fileInput[0]); // append the file only if selected
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You are about to update patient information.",
      showCancelButton: true,
      confirmButtonColor: "#51A485",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:3001/patient/updatePatientAdmin/${id}`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          Swal.fire("Success", "Patient information updated!", "success");
          navigate("/patient"); // go back to patient list
        })
        .catch((err) => {
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
             Swal.fire({
                                      icon: "error",
                                      title: "Access Denied",
                                      text: "Please login.",
                                      confirmButtonColor: "#51A485",
                                    });
            navigate('/');
          } else {
            console.error("Unexpected error", err);
          }
        });
      }
    });
  };

  if (!info) return <p>Loading patient data...</p>;

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <div className="container py-4 flex-grow-1">
        <h3 className="mb-4">Update Patient</h3>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="mb-3">
            <label>First Name</label>
            <input className="form-control" {...register("name")} />
            <p style={{ color: "red" }}>{errors.name?.message}</p>
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input className="form-control" {...register("lastname")} />
            <p style={{ color: "red" }}>{errors.lastname?.message}</p>
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input className="form-control" {...register("email")} />
            <p style={{ color: "red" }}>{errors.email?.message}</p>
          </div>

          <div className="mb-3">
            <label>Phone Number</label>
            <input className="form-control" {...register("phoneNumber")} />
            <p style={{ color: "red" }}>{errors.phoneNumber?.message}</p>
          </div>

          <div className="mb-3">
            <label>Date of Birth</label>
            <input className="form-control" type="date" {...register("birth")} />
            <p style={{ color: "red" }}>{errors.birth?.message}</p>
          </div>

          <div className="mb-3">
            <label>Gender</label>
             <select  className="form-control" name="gender" {...register("gender")}>
            <option value='' disabled hidden>Select gender</option>

              {gender.map((value,key)=>{
                return(
                <option key={key} value={value.gender_id}>{value.gender_name}</option>
                )
              })}
              </select>
            <p style={{ color: "red" }}>{errors.gender?.message}</p>
          </div>
          <div className="mb-3">
            <label>Profile Photo</label>
            <input className="form-control" type="file" {...register("photo")} />
          </div>
          <button className="btn btn-success" type="submit">Update Patient</button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePatient;
