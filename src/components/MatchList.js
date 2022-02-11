import React from 'react';
import axios from 'axios';
import { Card, Button, Col, Container, Row } from 'react-bootstrap';


export default class MatchList extends React.Component {
  state = {
    matches: []
  }

  componentDidMount() {
    axios.get(`https://pplelo.pythonanywhere.com/`)
      .then(res => {
        const matches = Object.values(res.data)
        console.log(matches)

        this.setState({ matches });
      })
  }

  render() {
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


                                    </Col>

                                    <Col xs={2}>
                                        <Button variant="dark" href={matches.link}>Room Faceit</Button>
                                        <br>
                                        </br>

                                        <div style={{marginTop: 20}}>
                                            <h5>{matches.team_a.result}{matches.team_b.result}</h5>

                                        </div>
                                        <br>
                                        </br>


                                        <div style={{marginTop: -25}}>
                                            <h5>{matches.map}</h5>

                                        </div>
                                        
                                        <br>
                                        </br>
                                        <div style={{marginTop: -25}}>
                                            <h5>{matches.location}</h5>

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