import logo from './logo.svg';
import './App.css';
import { Button, Navbar, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import pago from './images/pago.png';
import pagoreverse from './images/pago-reverse.png';
import MatchList from './components/MatchList.js';
import ClipLoader from "react-spinners/ClipLoader";

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Container>
          <Navbar variant="dark" bg="dark" className="navbar-back"  fixed="top" >
          
            
                <Col>
                  <img src={pago} style={{ width: "20%" }} className="pago"></img>
                  
                    
                  
                </Col>
                <Col xs={5}>
                  <Navbar.Brand>
                    <a>PPL Dywizja I - ELO Checker</a>
                    <br>
                    </br>
                    <a>by MBBN-BADBOYS</a>
                    
                  </Navbar.Brand>
                </Col>

                <Col>
                  <img src={pagoreverse} style={{ width: "20%" }} className="pago-reverse"></img>
                
                      
                </Col>
          </Navbar>

          <Container>

            <ClipLoader color="#00BFFF" size={100} />
            
              
              
            
              
            
          

            <MatchList></MatchList>
          
          </Container>





          
            

          



        </Container>
      </header>
    </div>
  );
}

export default App;
