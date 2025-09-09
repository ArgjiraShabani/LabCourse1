import React from "react";
import Button from "react-bootstrap/Button";
import Select from "react-select";

const AppointmentForm = ({
  patients,
  services,
  doctors,
  availableSlots,
  register,
  setValue,
  errors,
  handleSubmit,
  onSubmit,
  watchService,
  watchDate,
  editingId,
  setShowForm,
  today,
  maxDate
}) => {
  const patientOptions = patients.map(p => ({ value: p.patient_id, label: `${p.first_name} ${p.last_name}` }));
  const serviceOptions = services.map(s => ({ value: s.service_id, label: s.service_name }));
  const doctorOptions = doctors.map(d => ({ value: d.doctor_id, label: `${d.first_name} ${d.last_name}` }));
  const slotOptions = availableSlots.map(slot => ({ value: slot, label: slot }));

  return (
<div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
  <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "600px", width: "90%" }}>
    <form className="modal-content p-3" onSubmit={handleSubmit(onSubmit)}>
      <h5>{editingId ? "Edit Appointment" : "Book Appointment"}</h5>


      <div className="mb-3">
        <label>Patient</label>
        <Select
          options={patientOptions}
          onChange={option => setValue("patient_id", option?.value)}
          placeholder="Select Patient"
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          menuPortalTarget={document.body}
        />
        {errors.patient_id && <div className="text-danger">{errors.patient_id?.message}</div>}
      </div>

      <div className="mb-3">
        <label>First Name</label>
        <input {...register("name")} className={`form-control ${errors.name ? "is-invalid" : ""}`} />
        <div className="invalid-feedback">{errors.name?.message}</div>
      </div>

      <div className="mb-3">
        <label>Last Name</label>
        <input {...register("lastname")} className={`form-control ${errors.lastname ? "is-invalid" : ""}`} />
        <div className="invalid-feedback">{errors.lastname?.message}</div>
      </div>

      <div className="mb-3">
        <label>Service</label>
        <Select
          options={serviceOptions}
          onChange={option => setValue("service_id", option?.value)}
          placeholder="Select Service"
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          menuPortalTarget={document.body}
        />
        {errors.service_id && <div className="text-danger">{errors.service_id?.message}</div>}
      </div>

      <div className="mb-3">
        <label>Doctor</label>
        <Select
          options={doctorOptions}
          onChange={option => setValue("doctor_id", option?.value)}
          placeholder="Select Doctor"
          isDisabled={!watchService}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          menuPortalTarget={document.body}
        />
        {errors.doctor_id && <div className="text-danger">{errors.doctor_id?.message}</div>}
      </div>

      <div className="mb-3">
        <label>Date</label>
        <input
          type="date"
          {...register("date")}
          className={`form-control ${errors.date ? "is-invalid" : ""}`}
          min={today.toISOString().split("T")[0]}
          max={maxDate.toISOString().split("T")[0]}
        />
        {errors.date && <div className="text-danger">{errors.date?.message}</div>}
      </div>

      {watchDate && availableSlots.length > 0 && (
        <div className="mb-3">
          <label>Time Slot</label>
          <Select
            options={slotOptions}
            onChange={option => setValue("time", option?.value)}
            placeholder="Select Time Slot"
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
          />
          {errors.time && <div className="text-danger">{errors.time?.message}</div>}
        </div>
      )}

      {watchDate && availableSlots.length === 0 && (
        <div className="alert alert-warning">No available slots for this date.</div>
      )}

      <div className="mb-3">
        <label>Purpose</label>
        <textarea {...register("purpose")} className="form-control" />
      </div>
      
      <div className="d-flex flex-column flex-sm-row gap-2">
        <Button type="submit" size="sm" style={{ backgroundColor: "#51A485", borderColor: "#51A485", color: "#fff", width: "100%" }}>
          {editingId ? "Update" : "Book"}
        </Button>
        <Button type="button" size="sm" variant="danger" onClick={() => setShowForm(false)} style={{ width: "100%" }}>
          Cancel
        </Button>
      </div>
    </form>
  </div>
</div>

  );
};

export default AppointmentForm;