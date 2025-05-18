import { IoCloseSharp } from "react-icons/io5";
function Modal({closeModal}){

    return(
        <>
        <div style={{
            width: '100vw',
            height:'100vh',
            backgroundColor: 'rgba(200,200,200,0.8)',
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            left: 0,
            zIndex: 1000,}}>

        
        <div className="p-3 mb-2 bg-light text-dark" style={{width: '60%',height: '80%',overflowY: 'auto',borderRadius: '8px'}} >
            <IoCloseSharp onClick={closeModal} style={{cursor: 'pointer',float: 'right'}}/>
        <form className="container mt-4">
            <div className="row mb-3">
                <label for="symptoms" className="form-label">Symptoms:</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control" id="symptoms" aria-describedby="symptoms"/>
                </div>

                
            </div>
            <div className="row mb-3">
                <label for="diagnose" className="form-label">Diagnose:</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control" id="diagnose"/>
                </div>
                
            </div>
            <div className="row mb-3 ">
                <label className="form-label" for="alergies">Alergies:</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="alergies"/>
                </div>
                
                
            </div>
           
            <div className="row mb-3 ">
                <label className="form-label" for="description">Description:</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control" id="description"/>
                </div>
               
                
            </div>
            <div className="row mb-3 ">
                <div className="col-sm-10">
                    <input type="file" className="form-control" id="results"/>
                </div>
                
                
            </div>
            
            <button type="submit" className="btn m-5" style={{backgroundColor: '#51A485',color: '#fff'}}>Write prescription</button>
            <button type="submit" className="btn m-5"  style={{backgroundColor: '#51A485',color: '#fff'}}>Send by email</button>
            <button type="submit" className="btn m-5"  style={{backgroundColor: '#51A485',color: '#fff'}}>Print</button>
            </form>
            </div>
            </div>
        </>
    );

}
export default Modal;