function Footer(){
    return(
        <>
        <footer className="mt-auto text-center text-lg-start text-muted" style={{ backgroundColor: "#51A485", color: "#fff" }}>
                <section>
                    <div className="container text-center text-md-start mt-5"style={{  color: "#fff" }}>
                        <div className="row mt-3">
                            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold mb-4">
                                    CareWave Hospital
                                </h6>
                                <p>
                                    Here you can use rows and columns to organize your footer content.
                                </p>
                            </div>

                            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold mb-4">
                                    Useful links
                                </h6>
                                <p>
                                    <a href="#!" className="text-reset" style={{ color: "#fff" }}>Services</a>
                                </p>
                                <p>
                                    <a href="#!" className="text-reset" style={{ color: "#fff" }}>Staff</a>
                                </p>
                                <p>
                                    <a href="#!" className="text-reset" style={{ color: "#fff" }}>Bookings</a>
                                </p>
                                <p>
                                    <a href="#!" className="text-reset" style={{ color: "#fff" }}>Help</a>
                                </p>
                            </div>

                            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                                <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                                <p><i className="fas fa-home me-3"></i> Prishtina</p>
                                <p>
                                    <i className="fas fa-envelope me-3"></i>
                                    info@example.com
                                </p>
                                <p><i className="fas fa-phone me-3"></i> +383 123456</p>
                                <p><i className="fas fa-print me-3"></i> +383 67890</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-center p-4" style={{ backgroundColor: "#51A485", color: '#fff' }}>
                    © 2025 Copyright: CareWave Hospital
                </div>
            </footer>
        </>
    );
}
export default Footer;