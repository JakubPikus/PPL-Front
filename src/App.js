import React from "react";
import './App.css';
import { Navbar, Container, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import pago from './images/pago.png';
import pagoreverse from './images/pago-reverse.png';
import MatchList from './components/MatchList.js';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import filePathGirl from './3D/girl/scene.glb';
import filePathKnife from './3D/knife/scene.glb';


export default class App extends React.Component {

  componentDidMount() {

    // Tworzenie sceny

    var scene = new THREE.Scene();

    var scene2 = new THREE.Scene();


    // Efekty do sceny
    const ambient = new THREE.AmbientLight(0x404040,8);
    scene.add(ambient);

    const ambient2 = new THREE.AmbientLight(0x404040,8);
    scene2.add(ambient2);


    const directLightUp= new THREE.DirectionalLight(0xffffff, 3);
    directLightUp.position.set(-2,2,-2);
    scene.add(directLightUp)

    const directLightUp2= new THREE.DirectionalLight(0xffffff, 3);
    directLightUp2.position.set(3,1,2);
    scene2.add(directLightUp2)

   


    const directLightYellow= new THREE.DirectionalLight(0xffffff, 2);
    directLightYellow.position.set(2,1,2);
    scene.add(directLightYellow)

    const directLightYellow2= new THREE.DirectionalLight(0xffffff, 2);
    directLightYellow2.position.set(-2,-3,0);
    scene2.add(directLightYellow2)



    const directLightWhite = new THREE.DirectionalLight(0xffffff, 3);
    directLightWhite.position.set(-3,-2,1);
    scene.add(directLightWhite)

    const directLightWhite2 = new THREE.DirectionalLight(0xffffff, 3);
    directLightWhite2.position.set(3,2,-3);
    scene2.add(directLightWhite2)



    // Kamera
    var container = document.querySelector('.girl');

    var container2 = document.querySelector('.girl2');



    var camera = new THREE.PerspectiveCamera( 75, container.clientWidth/(container.clientHeight+200), 0.01, 100 );
    camera.position.set(-2,-1,-0.9);

    var camera2 = new THREE.PerspectiveCamera( 75, container2.clientWidth/(container2.clientHeight+100), 0.01, 100 );
    camera2.position.set(0,1,7);



    // Renderowanie
    var renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
    renderer.setSize( container.clientWidth, container.clientHeight+200 );
    this.mount.appendChild( renderer.domElement );

    var renderer2 = new THREE.WebGLRenderer({antialias:true, alpha: true});
    renderer2.setSize( container2.clientWidth, container2.clientHeight+100 );
    this.mount2.appendChild( renderer2.domElement );


    const controls = new OrbitControls(camera, renderer.domElement);

    const controls2 = new OrbitControls(camera2, renderer2.domElement);


    

    




    // Wczytanie modelu
    const loader = new GLTFLoader();
    loader.load(
      filePathGirl, 
      (gltf) => {
      scene.add( gltf.scene );
      
      })


    const loader2 = new GLTFLoader();
    loader2.load(
      filePathKnife, 
      (gltf) => {
      scene2.add( gltf.scene );
      
      })



    var animate = function () {
      requestAnimationFrame( animate );
      controls.update();
      controls2.update();
      renderer.render( scene, camera );
      renderer2.render( scene2, camera2 );
    };

    animate();
  }





  render() {

    
    return (
      <div className="App">
        <header className="App-header">
        <Container fluid>
            <Navbar variant="dark" bg="dark" className="navbar-back"  fixed="top" >
            
                  <Col>
                    <img src={pago} style={{ width: "20%" }} className="pago"></img>
                  </Col>

                  <Col xs={5}>
                    <Navbar.Brand>
                      <a>PPL Dywizja I - ELO Checker v2.0 (+ Livescore)</a>
                      <br>
                      </br>
                      <a>by MBBN-BADBOYS</a>
                    </Navbar.Brand>
                  </Col>

                  <Col>
                    <img src={pagoreverse} style={{ width: "20%" }} className="pago-reverse"></img>
                  </Col>
            </Navbar>
              <Row style={{height: "137px"}}>
                
              </Row>
            
              <Row>

                <Col lg={2} >
                      <div class="girl" ref={ref => (this.mount = ref)}  style={{height: "80vh",width:"16vw", position: "fixed", top: "-15vh", left: "0"}}/>

                    
                </Col>
    
                <Col lg={8}>
                  <MatchList></MatchList>
                </Col>
    
                <Col lg={2}>
                    <div class="girl2" ref={ref => (this.mount2 = ref)}  style={{height: "80vh", width:"16vw", position: "fixed", top: "50px", right: "0"}}/>
                </Col>

              </Row>
              
                
              

              
            

          </Container>
        </header>
      </div>
    )
  }
}


