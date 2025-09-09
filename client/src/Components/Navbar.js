import React from "react"
import { Link } from "react-router-dom";
function Navbar(){

  return(
    <>
   <nav className="navbar navbar-expand-lg">
  <div className="container-fluid">
    <div className="d-flex flex-column">
      <Link to='/' className="navbar-brand" style={{ fontSize: '30px' }}>CareWave</Link>
      <p style={{ marginTop: 0, lineHeight: 1, fontSize: '19px' }}>Hospital</p>
    </div>
    <div className="d-flex ms-auto">
      <div>
        <Link
          to="/signUp"
          className="btn btn-secondary btn-sm me-2"
          style={{
            backgroundColor: '#51A485',
            border: 'none',
            fontSize: '20px'
          }}
        >
          Sign up
        </Link>
      </div>
      <div>
        <Link
          to="/login"
          className="btn btn-secondary btn-sm me-2"
          style={{
            backgroundColor: '#51A485',
            border: 'none',
            fontSize: '20px'
          }}
        >
          Login
        </Link>
      </div>
    </div>
  </div>
</nav>







    
  </>
  );

}
export default Navbar