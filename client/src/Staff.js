import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import 'bootstrap/dist/css/bootstrap.min.css';
function MedicalStaff(){
    return(
        <>
            <div class="container my-4">
                <h1 class="text-center display-4" style={{color:"#51A485",marginTop:"50px",fontWeight:"bold"}}> Medical Staff</h1>
            </div>
            <div style={{display:"flex",justifyContent:"space-around",margin:"100px",flexWrap:"wrap",gap:"100px",}}>
                <div class="card" style={{width: "18rem",border:"1px solid #51A485"}}>
                    <img src="https://static.vecteezy.com/system/resources/previews/009/698/419/original/doctor-male-line-green-and-black-icon-vector.jpg" class="card-img-top" alt="..." style={{height:"230px"}}/>
                    <div class="card-body">
                        <p>Name: <b>Anita</b></p>
                        <p>LastName: <b>Maloku</b></p>
                        <p>Catagery: <b>Psikologe</b></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MedicalStaff;