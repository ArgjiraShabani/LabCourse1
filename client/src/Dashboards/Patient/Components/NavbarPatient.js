import React from "react"
import { Link } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom'; 

function NavbarPatient(){
  const param = useParams();
  const { id } = param; 

  return(
    <>
      <nav className="navbar">
        <div className="container-fluid">
          <div className="d-flex flex-column">
            <Link 
              to={`/homePagePatient`} 
              className="navbar-brand" 
              style={{ fontSize: '30px' }}
            >
              CareWave
            </Link>
            <p style={{ marginTop: 0, lineHeight: 1, fontSize: '19px' }}>Hospital</p>
          </div>

          <div className="d-flex ms-auto">
            <div>
              <Link
                to={`/myAppointments`}
                className="btn btn-secondary btn-sm me-2"
                style={{
                  backgroundColor: '#51A485',
                  border: 'none',
                  fontSize: '20px'
                }}
              >
                Dashboard
              </Link>
            </div>
            <div>
              <Link
                to="/logout"
                className="btn btn-secondary btn-sm me-2"
                style={{
                  backgroundColor: '#51A485',
                  border: 'none',
                  fontSize: '20px'
                }}
              >
                Logout
              </Link>
            </div>  
          </div> 
        </div>
      </nav>
    </>
  );
}

export default NavbarPatient;