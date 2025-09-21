import Sidebar from "../../Components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaGenderless, FaStethoscope, FaHospital } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { PiStudentFill } from "react-icons/pi";
import axios from "axios";
import Swal from "sweetalert2";

function DoctorProfile() {
  const [doctorData, setDoctorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [gender, setGender] = useState([]);
  const [specialization, setSpecialization] = useState([]);
  const [department, setDepartment] = useState([]);
  const [uploadImage, setUploadImage] = useState(null);

  const navigate = useNavigate();

 useEffect(() => {
  const fetchDoctorProfile = async () => {
    try {
     
      const profileRes = await axios.get("http://localhost:3001/api/doctorProfile", { withCredentials: true });

      if (profileRes.data.user?.role !== "doctor") {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Only doctors can access this page.",
        });
        return navigate("/login");
      }

      
      const dataRes = await axios.get("http://localhost:3001/api/doctorId", { withCredentials: true });

      const birthDate = dataRes.data.date_of_birth.split("T")[0];
      dataRes.data.date_of_birth = birthDate;

      setDoctorData(dataRes.data);
      setFormData(dataRes.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
        return;
      } else {
        console.error("Unexpected error fetching doctor profile:", error);
      }
    }
  };

  fetchDoctorProfile();
}, [navigate]);


 useEffect(() => {
  axios
    .get("http://localhost:3001/api/gender", { withCredentials: true })
    .then((res) => {
      setGender(res.data);
    })
    .catch((error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
        return;
      }
      console.error("Error fetching gender data:", error);
    });

  axios
    .get("http://localhost:3001/api/specializations", { withCredentials: true })
    .then((res) => {
      setSpecialization(res.data);
    })
    .catch((error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
        return;
      }
      console.error("Error fetching specializations:", error);
    });

  axios
    .get("http://localhost:3001/api/departments")
    .then((res) => {
      setDepartment(res.data);
    })
    .catch((error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
        return;
      }
      console.error("Error fetching departments:", error);
    });
}, [navigate]);

 

 const handleSave = () => {
  const data = new FormData();
  data.append("first_name", formData.first_name);
  data.append("last_name", formData.last_name);
  data.append("email", formData.email);
  data.append("phone", formData.phone);
  data.append("date_of_birth", formData.date_of_birth);
  data.append("gender_id", formData.gender_id);
  data.append("specialization_id", formData.specialization_id);
  data.append("department_Id", formData.department_Id);
  data.append("education", formData.education);

  if (uploadImage) {
    data.append("img", uploadImage);
  }

  axios
    .put("http://localhost:3001/api/updateMyProfile", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
      setUploadImage(null);

      axios
        .get("http://localhost:3001/api/doctorId", { withCredentials: true })
        .then((response) => {
          const birthDate = response.data.date_of_birth.split("T")[0];
          response.data.date_of_birth = birthDate;
          setDoctorData(response.data);
          setFormData(response.data);
        });
    })
    .catch((error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
        
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Something went wrong while updating the profile.",
        });
        console.error("Update error:", error);
      }
    });
};

  if (!doctorData) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div style={{ width: "250px" }}>
        <Sidebar role="doctor" />
      </div>
      <div className="flex-grow-1 d-flex justify-content-center align-items-start" style={{ padding: "40px" }}>
        <div
          className="container py-4"
          style={{
            width: "100%",
            maxWidth: "700px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 className="mb-4" style={{ color: "#51A485" }}>
            My profile
          </h2>

         
          <div className="text-center mb-4">
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                margin: "0 auto",
                overflow: "hidden",
                border: "3px solid rgb(86, 245, 186)",
                backgroundColor: "#ccc",
              }}
            >
              {uploadImage ? (
                <img
                  src={URL.createObjectURL(uploadImage)}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : doctorData.image_path ? (
                <img
                  src={`http://localhost:3001${doctorData.image_path}`}
                  alt={`${doctorData.first_name} ${doctorData.last_name}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    lineHeight: "150px",
                    textAlign: "center",
                    fontSize: "16px",
                    color: "#555",
                  }}
                >
                  No Image
                </div>
              )}
            </div>

            {/* File Input */}
            {isEditing && (
              <div className="mt-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setUploadImage(file);
                    }
                  }}
                  className="form-control w-auto mx-auto"
                />
              </div>
            )}
          </div>

        
          <ul
            className="list-group list-group-flush"
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              backgroundColor: "#fff",
              borderRadius: "10px",
            }}
          >
            <li className="list-group-item">
              <FaUser size={18} color="#51A485" className="me-2" />
              Name:
              {isEditing ? (
                <>
                  <input
                    type="text"
                    className="form-control d-inline w-auto mx-2"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-control d-inline w-auto mx-2"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </>
              ) : (
                <span> {doctorData.first_name} {doctorData.last_name}</span>
              )}
            </li>
            <li className="list-group-item">
              <FaEnvelope size={18} color="#51A485" className="me-2" />
              Email:
              {isEditing ? (
                <input
                  type="email"
                  className="form-control d-inline w-auto mx-2"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <span> {doctorData.email}</span>
              )}
            </li>
            <li className="list-group-item">
              <FaPhone size={18} color="#51A485" className="me-2" />
              Phone:
              {isEditing ? (
                <input
                  type="text"
                  className="form-control d-inline w-auto mx-2"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              ) : (
                <span> {doctorData.phone}</span>
              )}
            </li>
            <li className="list-group-item">
              <LuCalendarDays size={18} color="#51A485" className="me-2" />
              Date of Birth:
              {isEditing ? (
                <input
                  type="date"
                  className="form-control d-inline w-auto mx-2"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              ) : (
                <span> {doctorData.date_of_birth}</span>
              )}
            </li>
            <li className="list-group-item">
              <FaGenderless size={18} color="#51A485" className="me-2" />
              Gender:
              {isEditing ? (
                <select
                  className="form-select d-inline w-auto mx-2"
                  value={formData.gender_id}
                  onChange={(e) => setFormData({ ...formData, gender_id: Number(e.target.value) })}
                >
                  <option value="">Select gender</option>
                  {gender.map((g) => (
                    <option key={g.gender_id} value={g.gender_id}>
                      {g.gender_name}
                    </option>
                  ))}
                </select>
              ) : (
                `${doctorData.gender_name}`
              )}
            </li>
            <li className="list-group-item">
              <PiStudentFill size={25} color="#51A485" className="me-2" />
              Education:
              {isEditing ? (
                <input
                  type="text"
                  className="form-control d-inline w-auto mx-2"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                />
              ) : (
                <span> {doctorData.education}</span>
              )}
            </li>
            <li className="list-group-item">
              <FaStethoscope size={18} color="#51A485" className="me-2" />
              Specialization:
              {isEditing ? (
                <select
                  className="form-select d-inline w-auto mx-2"
                  value={formData.specialization_id}
                  onChange={(e) => setFormData({ ...formData, specialization_id: Number(e.target.value) })}
                >
                  <option value="">Select specialization</option>
                  {specialization.map((s) => (
                    <option key={s.specialization_id} value={s.specialization_id}>
                      {s.specialization_name}
                    </option>
                  ))}
                </select>
              ) : (
                `${doctorData.specialization_name}`
              )}
            </li>
            <li className="list-group-item">
              <FaHospital size={18} color="#51A485" className="me-2" />
              Department:
              {isEditing ? (
                <select
                  className="form-select d-inline w-auto mx-2"
                  value={formData.department_Id}
                  onChange={(e) => setFormData({ ...formData, department_Id: Number(e.target.value) })}
                >
                  <option value="">Select department</option>
                  {department.map((d) => (
                    <option key={d.department_Id} value={d.department_Id}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              ) : (
                `${doctorData.department_name}`
              )}
            </li>
          </ul>

          
          <div className="text-center mt-4">
            {isEditing ? (
              <>
                <button className="btn btn-success mx-2" onClick={handleSave} style={{ backgroundColor: "#51A485" }}>
                  Save
                </button>
                <button
                  className="btn btn-secondary mx-2"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(doctorData);
                    setUploadImage(null);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-primary" style={{ backgroundColor: "#51A485" }} onClick={() => setIsEditing(true)}>
                Edit profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
