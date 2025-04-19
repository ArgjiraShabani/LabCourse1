import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Link } from 'react-router-dom';
function MedicalStaff(){
    return(
        <>
        <hr style={{color:'#51A485 '}}/>
            <div>
                <Link to="/"  className="btn btn-primary" style={{
              backgroundColor:'#51A485 ',
              border: 'none',
              fontSize: '25px',
              textDecoration: 'none',
              color: 'white',
              padding: '1px 30px ',
              display: 'inline-block',
              marginLeft:"10px"
            }}><i className="bi bi-arrow-left"></i></Link>
            </div>
            <div class="container my-4">
                <h1 class="text-center display-4" style={{color:"#51A485",marginTop:"50px",fontWeight:"bold"}}> Medical Staff</h1>
            </div>
            <div style={{display:"flex",justifyContent:"space-around",margin:"100px",flexWrap:"wrap",gap:"100px",}}>
                <div class="card" style={{width: "18rem",border:"1px solid #51A485"}}>
                    <img src="https://www.nicepng.com/png/detail/867-8678512_doctor-icon-physician.png" class="card-img-top" alt="..." style={{height:"270px"}}/>
                    <div class="card-body">
                        <p>Name: XXX</p>
                        <p>LastName: YYY</p>
                        <p>Catagery: ZZZ</p>
                    </div>
                </div>  <div class="card" style={{width: "18rem",border:"1px solid #51A485"}}>
                    <img src="https://www.nicepng.com/png/detail/867-8678512_doctor-icon-physician.png" class="card-img-top" alt="..." style={{height:"270px"}}/>
                    <div class="card-body">
                        <p>Name: XXX</p>
                        <p>LastName: YYY</p>
                        <p>Catagery: ZZZ</p>
                    </div>
                </div>
                <div class="card" style={{width: "18rem",border:"1px solid #51A485"}}>
                    <img src="https://www.nicepng.com/png/detail/867-8678512_doctor-icon-physician.png" class="card-img-top" alt="..." style={{height:"270px"}}/>
                    <div class="card-body">
                        <p>Name: XXX</p>
                        <p>LastName: YYY</p>
                        <p>Catagery: ZZZ</p>
                    </div>
                </div>
                <div class="card" style={{width: "18rem",border:"1px solid #51A485"}}>
                    <img src="https://www.nicepng.com/png/detail/867-8678512_doctor-icon-physician.png" class="card-img-top" alt="..." style={{height:"270px"}}/>
                    <div class="card-body">
                        <p>Name: XXX</p>
                        <p>LastName: YYY</p>
                        <p>Catagery: ZZZ</p>
                    </div>
                </div>
               
            </div>
        </>
    )
}

export default MedicalStaff;