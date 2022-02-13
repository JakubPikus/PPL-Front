import React from 'react';
import axios from 'axios';
import { Card, Button, Col, Container, Row } from 'react-bootstrap';
import Lvl10 from '../images/faceit10.svg';
import Lvl9 from '../images/faceit9.svg';
import Lvl8 from '../images/faceit8.svg';
import Lvl7 from '../images/faceit7.svg';
import Lvl6 from '../images/faceit6.svg';
import defaultUser from '../images/defaultuser.png';
import faceitProfile from '../images/user.png';


export default class MatchList extends React.Component {
  state = {
    matches: []
  }

  componentDidMount() {
    //axios.get(`http://127.0.0.1:8000/`)
    axios.get(`https://pplelo.pythonanywhere.com/`)
      .then(res => {
        const matches = Object.values(res.data)
        console.log(matches)
        

        this.setState({ matches });
      })
  }


  render() {

    let imgURL = {
      10: Lvl10,
      9: Lvl9,
      8: Lvl8,
      7: Lvl7,
      6: Lvl6
    }

    return (
    <div>
      <ul>
        {
          this.state.matches
            .map(matches =>
              <div>
                <li key={matches.id}>


                  <Card className="text-center mt-5">
                    <Card.Body>
                      <Card.Text>
                        <div style={{ color: 'black' }}>
                          <Container>

                          
                            <Container>
                                <Row>
                                    <Col>
                                    <h1>{matches.team_a.name}</h1>
                                    
                                    <div style={{marginTop: -20}}> 
                                        <a style={{ fontSize: "13px"}}>Średnie ELO - {matches.team_a.points.avarage_elo}</a>

                                    </div>
                                    <br></br>

                                    <div style={{marginTop: -60}}>
                                        <a style={{ fontSize: "13px", color: "green"}}>{matches.team_a.points.win}</a><a style={{ fontSize: "13px"}}> / </a><a style={{ fontSize: "13px", color: "red"}}>{matches.team_a.points.lose}</a>

                                  

                                    </div>

                                    

                                    <div>
                                      {Object.values(matches.team_a.players).map(players =>{
                                        

                                        return <Row>
                                          <Col xs={2}><img src={players.image ? players.image : defaultUser} style={{ width: "45px", height: "45px" }}></img></Col>
                                          <Col xs={4}><a style={{ fontSize: "18px"}}>{players.nick}</a></Col>
                                          <Col xs={2}><img src={imgURL[players.level]} style={{ width: "30px", height: "30px" }}></img></Col>
                                          <Col xs={3}><a style={{ fontSize: "18px"}}>{players.elo}</a></Col>
                                          <Col xs={1}><a href={players.profile}><img src={faceitProfile} style={{ width: "20px", height: "20px" }}></img></a></Col>
                                          
                                          

                                        </Row>
                                      })
                                      }
                                    </div>


                                    </Col>

                                    <Col xs={2} >
                                        <Button variant="dark" href={matches.link}>Room Faceit</Button>
                                        <br>
                                        </br>
                                        <div style={{marginTop: 50}}>

                                          <div >
                                              <h5>{matches.team_a.result}{matches.team_b.result}</h5>

                                          </div>
                                          <br>
                                          </br>


                                          <div >
                                              <h5>{matches.map}</h5>

                                          </div>
                                          
                                          <br>
                                          </br>
                                          <div >
                                              <h5>{matches.location}</h5>

                                          </div>
                                        </div>

                                        
                                    </Col>
                                    <Col>
                                    <h1>{matches.team_b.name}</h1>
                                    <div style={{marginTop: -20}}>  
                                        <a style={{ fontSize: "13px"}}>Średnie ELO - {matches.team_b.points.avarage_elo}</a>      
                                    
                                    </div>
                                    <br></br>

                                    <div style={{marginTop: -60}}> 
                                        <a style={{ fontSize: "13px", color: "green"}}>{matches.team_b.points.win}</a><a style={{ fontSize: "13px"}}> / </a><a style={{ fontSize: "13px", color: "red"}}>{matches.team_b.points.lose}</a>

                                    </div>

                                    <div>
                                      {Object.values(matches.team_b.players).map(players =>{

                                        

                                        return <Row>
                                          <Col xs={1}><a href={players.profile}><img src={faceitProfile} style={{ width: "20px", height: "20px" }}></img></a></Col>
                                          <Col xs={3}><a style={{ fontSize: "18px"}}>{players.elo}</a></Col>
                                          <Col xs={2}><img src={imgURL[players.level]} style={{ width: "30px", height: "30px" }}></img></Col>
                                          <Col xs={4}><a style={{ fontSize: "18px"}}>{players.nick}</a></Col>
                                          <Col xs={2}><img src={players.image ? players.image : defaultUser} style={{ width: "45px", height: "45px" }}></img></Col>
                                          
                                        </Row>
                                      })
                                      }
                                    </div>


                                    


                                    </Col>
                                </Row>


                            </Container>
                          </Container>


                        </div>

                        
                        
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  
                  
                  

                  </li>
                
              </div>
            )
        }
      </ul>

      
    </div>
    )
  }
}