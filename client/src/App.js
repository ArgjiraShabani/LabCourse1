
import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HomePage from './Pages/HomePage';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';



function App() {
  return (
    <>
    
    <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar/>
            <main className="flex-grow-1">
              <Routes>
                <Route path='/' element={<HomePage/>}/>

              </Routes>
            </main>
          <Footer/>
        </div>
      </Router>
    </>    
  );
}

export default App;
