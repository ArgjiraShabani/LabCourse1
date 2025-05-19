import React, { useState, useEffect } from "react";
import axios from "axios";

function BookAppointment() {
    const [services, setServices] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        service_id: "",
        doctor_id: "",
        appointment_datetime: "",
        purpose: ""
    });

    useEffect(() => {
        axios.get("http://localhost:3001/services")
            .then(res => {
                console.log("Services fetched:", res.data);
                setServices(res.data);
            })
            .catch(err => console.error("Error fetching services:", err));
    }, []);

   useEffect(() => {
    if (formData.service_id && services.length > 0) {
        const selectedService = services.find(
            (service) => parseInt(service.service_id) === parseInt(formData.service_id)
        );

        if (selectedService && selectedService.department_Id) {
            axios.get(`http://localhost:3001/doctors/byDepartment/${selectedService.department_Id}`)
                .then(res => setDoctors(res.data))
                .catch(err => {
                    console.error("Error fetching doctors:", err);
                    setDoctors([]);
                });
        } else {
            setDoctors([]);
        }
    } else {
        setDoctors([]);
    }
}, [formData.service_id, services]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "service_id" || name === "doctor_id" ? parseInt(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const patient_id = localStorage.getItem("patient_id");
        if (!patient_id) return alert("You must be logged in.");

        axios.post("http://localhost:3001/appointments", {
            ...formData,
            appointment_date: formData.appointment_datetime,
            patient_id,
            status: "Pending"
        })
        .then(res => alert(res.data.message))
        .catch(err => {
            console.error(err);
            alert("Booking failed");
        });
    };

    return (
        <div className="container mt-5">
            <h2>Book Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Service</label>
                    <select
                        className="form-control"
                        name="service_id"
                        value={formData.service_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Service</option>
                        {services.map(service => (
                            <option key={service.service_id} value={service.service_id}>
                                {service.service_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Doctor</label>
                    <select
                        className="form-control"
                        name="doctor_id"
                        value={formData.doctor_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Doctor</option>
                        {doctors.map(doc => (
                            <option key={doc.doctor_id} value={doc.doctor_id}>
                                {doc.first_name} {doc.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Date & Time</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="appointment_datetime"
                        value={formData.appointment_datetime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Purpose</label>
                    <textarea
                        className="form-control"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-success">Book Appointment</button>
            </form>
        </div>
    );
}

export default BookAppointment;