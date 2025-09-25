import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Select from "react-select";

import Sidebar from "../../../Components/AdminSidebar";
import { generateSlots } from "./utils";

const AppointmentsTable = lazy(() => import("./AppointmentTable"));
const AppointmentForm = lazy(() => import("./AppointmentForm"));



const schema = yup.object().shape({
  patient_id: yup.number().when("$isEditing", (isEditing, schema) =>
    isEditing ? schema.notRequired() : schema.required("Patient is required")
  ),
  name: yup.string().when("$isEditing", (isEditing, schema) =>
    isEditing ? schema.notRequired() : schema.required("First name is required")
  ),
  lastname: yup.string().when("$isEditing", (isEditing, schema) =>
    isEditing ? schema.notRequired() : schema.required("Last name is required")
  ),
  service_id: yup.number().required("Service is required"),
  doctor_id: yup.number().required("Doctor is required"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
  purpose: yup.string(),
});


function PatientAppointments() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [filterPatient, setFilterPatient] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterDate, setFilterDate] = useState("");
 const [appointmentDuration, setAppointmentDuration] = useState(30); 

  const today = new Date();
  const [daysLimit, setDaysLimit] = useState(30);
  const [maxDate, setMaxDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [formData, setFormData] = useState({ doctor_id: "", service_id: "" });
  

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema, { context: { isEditing: !!editingId } }),
  });

  const watchService = watch("service_id");
  const watchDoctor = watch("doctor_id");
  const watchDate = watch("date");

  useEffect(() => {
  axios
    .get("http://localhost:3001/api/settings", { withCredentials: true })
    .then((res) => {
      const limit = res.data?.booking_days_limit ?? 30;
      const duration = res.data?.appointment_duration_minutes ?? 30;

      setDaysLimit(limit);
      setAppointmentDuration(duration);

      if (limit > 0) {
        const max = new Date(today);
        max.setDate(max.getDate() + (limit - 1));
        setMaxDate(max);
      } else {
        setMaxDate(today);
      }
    })
    .catch(() => {
      const max = new Date(today);
      max.setDate(max.getDate() + 29);
      setMaxDate(max);
    });
}, []);

  useEffect(() => {
  axios
    .get("http://localhost:3001/PatientAppointments", { withCredentials: true })
    .then((res) => {
      if (res.data.user?.role !== "admin") {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Only admin can access this page.",
          confirmButtonColor: "#51A485",
        });
        navigate("/login");
        return;
      }
      setUserRole(res.data.user.role);
      setLoading(false);
    })
    .catch((err) => {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        
        navigate("/login");
      } else {
        console.error("Unexpected error", err);
      }
    });
}, [navigate]);


  useEffect(() => {
    if (userRole !== "admin") return;
    axios.all([
      axios.get("http://localhost:3001/all-patient-appointments", { withCredentials: true }),
      axios.get("http://localhost:3001/services", { withCredentials: true }),
      axios.get("http://localhost:3001/patient/patients-dropdown", { withCredentials: true }),
    ])
      .then(axios.spread((appsRes, servicesRes, patientsRes) => {
        setAppointments(appsRes.data);
        setServices(servicesRes.data);
        setPatients(patientsRes.data);
      }))
      .catch(err => console.error(err));
  }, [userRole]);

  useEffect(() => {
    if (!watchService) {
      setDoctors([]);
      setValue("doctor_id", "");
      setAvailableSlots([]);
      return;
    }
    const service = services.find(s => s.service_id === parseInt(watchService));
    if (!service) return;

    axios.get(`http://localhost:3001/doctors/byDepartment/${service.department_Id}`, { withCredentials: true })
      .then(res => setDoctors(res.data))
      .catch(() => setDoctors([]));

    setValue("doctor_id", "");
    setAvailableSlots([]);
  }, [watchService, services, setValue]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, doctor_id: watchDoctor }));
    setSelectedDate(watchDate);
  }, [watchDoctor, watchDate]);

useEffect(() => {
  const fetchSlots = async () => {
    if (!selectedDate || !formData.doctor_id) return;

    const selDateObj = new Date(selectedDate);
    const todayOnly = new Date();
    todayOnly.setHours(0, 0, 0, 0);

    if (selDateObj < todayOnly || selDateObj > maxDate) return;

    try {
      const [standardRes, customRes] = await Promise.all([
        axios.get("http://localhost:3001/api/standardSchedules", { withCredentials: true }),
        axios.get("http://localhost:3001/api/weekly-schedules", { withCredentials: true }),
      ]);

      const weekday = selDateObj.toLocaleDateString("en-US", { weekday: "long" });
      const custom = customRes.data.find(s => s.doctor_id === formData.doctor_id && s.weekday === weekday);
      const standard = standardRes.data.find(s => s.doctor_id === formData.doctor_id && s.weekday === weekday);
      let todaySchedule = custom || standard;

      const prevDay = new Date(selDateObj);
      prevDay.setDate(prevDay.getDate() - 1);
      const prevWeekday = prevDay.toLocaleDateString("en-US", { weekday: "long" });
      const prevCustom = customRes.data.find(s => s.doctor_id === formData.doctor_id && s.weekday === prevWeekday);
      const prevStandard = standardRes.data.find(s => s.doctor_id === formData.doctor_id && s.weekday === prevWeekday);
      let prevSchedule = prevCustom || prevStandard;

      let allSlots = [];

      if (prevSchedule) {
        const [prevStartH, prevStartM] = prevSchedule.start_time.split(":").map(Number);
        const [prevEndH, prevEndM] = prevSchedule.end_time.split(":").map(Number);
        if (prevEndH < prevStartH || (prevEndH === prevStartH && prevEndM < prevStartM)) {
          allSlots = [...allSlots, ...generateSlots("00:00", prevSchedule.end_time, appointmentDuration)];
        }
      }

      if (todaySchedule) {
        const [startH, startM] = todaySchedule.start_time.split(":").map(Number);
        const [endH, endM] = todaySchedule.end_time.split(":").map(Number);

        if (endH < startH || (endH === startH && endM < startM)) {
          allSlots = [...allSlots, ...generateSlots(todaySchedule.start_time, "23:59", appointmentDuration)];
        } else {
          allSlots = [...allSlots, ...generateSlots(todaySchedule.start_time, todaySchedule.end_time, appointmentDuration)];
        }
      }

      const bookedRes = await axios.get("http://localhost:3001/appointments/bookedSlots", {
        params: { doctor_id: formData.doctor_id, date: selectedDate },
        withCredentials: true,
      });

      const bookedSlots = bookedRes.data;
      setAvailableSlots(allSlots.filter(slot => !bookedSlots.includes(slot)));
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Please login.",
          confirmButtonColor: "#51A485",
        });
        navigate("/");
      } else {
        console.error("Error fetching available slots:", err.message);
        setAvailableSlots([]);
      }
    }
  };

  fetchSlots();
}, [formData.doctor_id, selectedDate, maxDate, navigate, appointmentDuration]);




  const openForm = (appointment = null) => {
    if (appointment) {
      reset({
        patient_id: appointment.patient_id,
        name: appointment.patient_name,
        lastname: appointment.patient_lastname,
        service_id: appointment.service_id,
        doctor_id: appointment.doctor_id,
        date: appointment.appointment_datetime.split("T")[0],
        time: appointment.appointment_time || "",
        purpose: appointment.purpose,
      });
      setEditingId(appointment.id);
    } else {
      reset({ patient_id: "", name: "", lastname: "", service_id: "", doctor_id: "", date: "", time: "", purpose: "" });
      setEditingId(null);
      setAvailableSlots([]);
    }
    setShowForm(true);
  };

  const onSubmit = (data) => {
  if (!data.date || !data.time) {
    Swal.fire("Missing Info", "Please select date and time.", "warning");
    return;
  }

  const payload = { ...data, appointment_datetime: `${data.date}T${data.time}`, status: "pending" };

  let req;
  if (!editingId) {
    req = axios.post("http://localhost:3001/appointments", payload, { withCredentials: true });
  } else {
    const url =
      userRole === "admin"
        ? `http://localhost:3001/appointments/${editingId}`
        : `http://localhost:3001/my-appointments/${editingId}`;
    req = axios.put(url, payload, { withCredentials: true });
  }

  req
    .then(() => {
      Swal.fire(editingId ? "Updated!" : "Booked!", "", "success");
      setShowForm(false);
      const fetchAppointmentsUrl =
        userRole === "admin"
          ? "http://localhost:3001/all-patient-appointments"
          : "http://localhost:3001/my-appointments";
      axios
        .get(fetchAppointmentsUrl, { withCredentials: true })
        .then((res) => setAppointments(res.data))
        .catch((err) => console.error("Error fetching appointments:", err));
    })
    .catch((error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Please login.",
          confirmButtonColor: "#51A485",
        });
        navigate("/");
      } else {
        Swal.fire("Error", "Something went wrong", "error");
        console.error("Error submitting appointment:", error);
      }
    });
};


   const handleDelete = (id) => {
  Swal.fire({
    title: "Delete this appointment?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
  }).then((result) => {
    if (!result.isConfirmed) return;

    const url =
      userRole === "admin"
        ? `http://localhost:3001/all-patient-appointments/${id}`
        : `http://localhost:3001/my-appointments/${id}`;

    axios
      .delete(url, { withCredentials: true })
      .then(() => {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        Swal.fire("Deleted!", "", "success");
      })
      .catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Please login.",
            confirmButtonColor: "#51A485",
          });
          navigate("/");
        } else {
          Swal.fire("Failed", "", "error");
          console.error("Error deleting appointment:", error);
        }
      });
  });
};


  const allPatients = Array.from(new Set(appointments.map(a => `${a.patient_name} ${a.patient_lastname}`))).map(p => ({ value: p, label: p }));
  const allDoctors = Array.from(new Set(appointments.map(a => a.doctor_name || `${a.doctor_firstname} ${a.doctor_lastname}`))).map(d => ({ value: d, label: d }));
  const allServices = Array.from(new Set(appointments.map(a => a.service_name))).map(s => ({ value: s, label: s }));

  const filteredAppointments = appointments.filter(app => {
    const patientFullName = `${app.patient_name} ${app.patient_lastname}`;
    const doctorFullName = app.doctor_name || `${app.doctor_firstname} ${app.doctor_lastname}`;
    const dateOnly = app.appointment_datetime.split("T")[0];

    return (filterPatient === "" || patientFullName === filterPatient) &&
      (filterDoctor === "" || doctorFullName === filterDoctor) &&
      (filterService === "" || app.service_name === filterService) &&
      (filterDate === "" || dateOnly === filterDate);
  });

  const todayStr = today.toISOString().split("T")[0];

const completedAppointments = filteredAppointments.filter(app => {
  const appDate = new Date(app.appointment_datetime);
  return (
    (app.status || "pending").toLowerCase() === "completed" &&
    appDate.getFullYear() === today.getFullYear() &&
    appDate.getMonth() === today.getMonth() &&
    appDate.getDate() === today.getDate()
  );
});



const otherAppointmentsForAdmin = filteredAppointments.filter(
  app => (app.status || "pending").toLowerCase() !== "completed"
);


  if (loading) return <div>Loading...</div>;
  if (userRole !== "admin") return null;

  return (
<div className="d-flex flex-row" style={{ minHeight: "100vh" }}>
  <Sidebar role={userRole} />
  <div className="container py-4 flex-grow-1">

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-2 mb-4">
          <h2>Appointments</h2>
          <Button style={{ backgroundColor: "#51A485", borderColor: "#51A485" }} size="md" onClick={() => openForm()}>Book Appointment</Button>
        </div>

       <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
  <Select
    options={allPatients} placeholder="All Patients"
    onChange={option => setFilterPatient(option?.value || "")}
    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
    menuPortalTarget={document.body}
    isClearable
  />
  <Select
    options={allDoctors} placeholder="All Doctors"
    onChange={option => setFilterDoctor(option?.value || "")}
    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
    menuPortalTarget={document.body}
    isClearable
  />
  <Select
    options={allServices} placeholder="All Services"
    onChange={option => setFilterService(option?.value || "")}
    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
    menuPortalTarget={document.body}
    isClearable
  />
  <input
    type="date"
    className="form-control"
    style={{
      width: "200px", 
      height: "38px",  
       border: "1px solid hsl(0, 0%, 80%)", 
      borderRadius: "5px",
      padding: "0 10px",
    }}
    onChange={e => setFilterDate(e.target.value)}

  />
</div>

   <h2>All Appointments</h2>
<Suspense fallback={<div>Loading Table...</div>}>
  <div className="table-responsive">
    <AppointmentsTable 
      appointments={otherAppointmentsForAdmin} 
      onEdit={openForm} 
      onDelete={handleDelete} 
    />
  </div>
</Suspense>

<h2 className="mt-5">Completed Appointments For Today</h2>
<Suspense fallback={<div>Loading Completed Appointments...</div>}>
  <div className="table-responsive">
    <AppointmentsTable 
      appointments={completedAppointments} 
      onEdit={null}
      onDelete={null} 
    />
  </div>
</Suspense>
        {showForm && (
          <Suspense fallback={<div>Loading Form...</div>}>
            <AppointmentForm
              patients={patients}
              services={services}
              doctors={doctors}
              availableSlots={availableSlots}
              register={register}
              setValue={setValue}
              errors={errors}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              watchService={watchService}
              watchDate={watchDate}
              editingId={editingId}
              setShowForm={setShowForm}
              today={today}
              maxDate={maxDate}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default PatientAppointments;