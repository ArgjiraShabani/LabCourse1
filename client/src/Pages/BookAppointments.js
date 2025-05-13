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
            .then(res => setServices(res.data))
            .catch(err => console.error("Error fetching services:", err));
    }, []);

    useEffect(() => {
        if (formData.service_id) {
            axios.get(`http://localhost:3001/doctors/byService/${formData.service_id}`)
                .then(res => {
                    console.log("Mjekët e ardhur:", res.data);
                    setDoctors(res.data);
                })
                .catch(err => console.error("Error fetching doctors:", err));
        } else {
            setDoctors([]); 
        }
    }, [formData.service_id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                    <input type="text" className="form-control" name="name" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label>Last Name</label>
                    <input type="text" className="form-control" name="lastname" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label>Service</label>
                    <select className="form-control" name="service_id" onChange={handleChange} required>
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
                    <select className="form-control" name="doctor_id" onChange={handleChange} required>
                        <option value="">Select Doctor</option>
                        {doctors.map(doc => (
                            <option key={doc.doctor_id} value={doc.doctor_id}>
                                {doc.name} {doc.lastname}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Date & Time</label>
                    <input type="datetime-local" className="form-control" name="appointment_datetime" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label>Purpose</label>
                    <textarea className="form-control" name="purpose" onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-success">Book Appointment</button>
            </form>
        </div>
    );
}

export default BookAppointment;
