import slide1 from "../assets/family_doctor.jpg";
import slide2 from "../assets/ooking-ahead-the-outlook-for-australias-private-hospitals.jpg";
import slide3 from "../assets/Brain-Stimulation-Surgery-20250204-01.jpg";
import "../App.css";
import { Link } from "react-router-dom";
function HomePage() {
  return (
    <>
      <div
        id="carouselExampleIndicators"
        className="carousel slide"
        style={{ width: "100%", height: "100vh" }} // Carousel height set to 25vh
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner" style={{ height: "100%" }}>
          <div className="carousel-item active" style={{ height: "100%" }}>
            <img
              src={slide1}
              className="d-block w-100"
              alt="slide1"
              style={{
                objectFit: "cover",
                filter: "brightness(0.6)",
                height: "100%",
              }}
            />
          </div>
          <div className="carousel-item " style={{ height: "100%" }}>
            <img
              src={slide2}
              className="d-block w-100"
              alt="slide2"
              style={{
                objectFit: "cover",
                filter: "brightness(0.6)",
                height: "100%",
              }}
            />
          </div>
          <div className="carousel-item " style={{ height: "100%" }}>
            <img
              src={slide3}
              className="d-block w-100 "
              alt="slide3"
              style={{
                objectFit: "cover",
                filter: "brightness(0.6)",
                height: "100%",
              }}
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div
        style={{
          width: "100%",
          padding: "80px 40px",
          textAlign: "center",
          border: "solid 2px #51A485",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "35px",
            color: "#51A485",
            marginTop: "30px",
          }}
        >
          Transforming your care. Healing starts here.
        </h1>
        <p style={{ fontSize: "25px" }}>
          With 20 departaments and over 250 specialised doctors and medical
          workers, <br />
          CareWave Hospital is here to make healthcare more accessible than
          ever. Easy, <br />
          fast and simple way to connect to our doctors and services.
          <br />
          Your next doctor's appintment is one click away.
        </p>
        <div class="d-grid gap-2 col-6 mx-auto">
          <button
            type="button"
            class="btn btn-primary"
            style={{
              backgroundColor: "#51A485",
              border: "none",
              fontSize: "25px",
            }}
          >
            Book your appointment
          </button>
          <Link
            to="/staff"
            className="btn btn-primary"
            style={{
              backgroundColor: "#51A485",
              border: "none",
              fontSize: "25px",
              textDecoration: "none",
              color: "white",
              padding: "10px 20px",
              display: "inline-block",
            }}
          >
            Our staff
          </Link>
        </div>
      </div>
      <div className="container-fluid py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: "#51A485" }}>
            Contact Us
          </h2>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="bg-white p-4 rounded shadow-sm h-100">
                <div className="mb-4">
                  <h5 style={{ color: "#51A485" }}>Our Location</h5>
                  <p className="mb-0">
                    <i
                      className="bi bi-geo-alt-fill me-2"
                      style={{ color: "#51A485" }}
                    ></i>
                    Kosovë: Ulpianë, Prishtinë 10000
                  </p>
                </div>

                <div className="mb-4">
                  <h5 style={{ color: "#51A485" }}>Contact Details</h5>
                  <p className="mb-2">
                    <i
                      className="bi bi-envelope-fill me-2"
                      style={{ color: "#51A485" }}
                    ></i>
                    carewareinfo@gmail.com
                  </p>
                  <p className="mb-0">
                    <i
                      className="bi bi-telephone-fill me-2"
                      style={{ color: "#51A485" }}
                    ></i>
                    +355 33 456 789 / +383 33 122 333
                  </p>
                </div>

                <hr />

                <h5 className="mb-3" style={{ color: "#51A485" }}>
                  Leave us a feedback
                </h5>
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First Name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Your Message"
                        required
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn w-100 py-2"
                        style={{
                          backgroundColor: "#51A485",
                          color: "white",
                        }}
                      >
                        <i className="bi bi-send-fill me-2"></i> Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="ratio ratio-4x3">
                <iframe
                  src="https://maps.google.com/maps?width=490&amp;height=400&amp;hl=en&amp;q=Ulpiane,%20PRISHTINE%2010000+(CareWave%20Hospital)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  title="CareWave Location"
                  allowFullScreen
                  loading="lazy"
                  style={{ border: "0" }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default HomePage;
