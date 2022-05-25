import React from 'react';
import axios from 'axios';
import { Button, Col, Container, Row, Modal } from 'react-bootstrap';
import '../ButtonStatistic.css';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
  } from "recharts";
import defaultUser from '../images/defaultuser.png';
import Lvl10 from '../images/faceit10.svg';
import Lvl9 from '../images/faceit9.svg';
import Lvl8 from '../images/faceit8.svg';
import Lvl7 from '../images/faceit7.svg';
import Lvl6 from '../images/faceit6.svg';
import Win from '../images/win.png';
import Lose from '../images/lose.png';


  



  let backlink = "http://127.0.0.1:8000/"





  const imgURL = {
    10: Lvl10,
    9: Lvl9,
    8: Lvl8,
    7: Lvl7,
    6: Lvl6
  }



  const winOrLose = (status) =>{
    if(status == 1 || status == "W"){
      return <img className="win_lose_img" src={Win}></img>
    }
    if(status == 0 || status == "L"){
      return <img className="win_lose_img" src={Lose}></img>


    }
  }



  const CustomTooltip = ({ active, payload }) => {
    
    if (active && payload && payload.length) {
      return (
        <Container fluid className="text-nowrap">
          <Row>
            <p>{payload[0].payload.name_opponents_team}</p>
          </Row>
          <Row>
            <Col xs={6}>
              <p>{payload[0].payload.game_map}</p>

            </Col>
            <Col xs={6}>
              <p>Wynik - {payload[0].payload.game_result}</p>
            </Col>
          </Row>

          <Row>
            <Col xs={6}>
              <p>K/D - {payload[0].payload.kd}</p>

            </Col>
            <Col xs={6}>
              <p>K/R - {payload[0].payload.kr}</p>
            </Col>
          </Row>

          <Row>
            <Col xs={6}>
              <p>Staty - {payload[0].payload.kak}</p>
            </Col>
            <Col xs={6} className="tooltip-col">
              <p>{winOrLose(payload[0].payload.win)}</p>
            </Col>
          </Row>

          
        </Container>
      );
    }
  
    return null;
  };




export default class ButtonStatistic extends React.Component {
    state = {
        show: false,
        data: [],
      }

    enable = () => {

        this.getStats()
        this.setState({ 
            show: true
          });

    }


    getStats = () => {
      

      let axiosArrayStatsPlayers = []


      for(var p = 0; p < 5 ; p++){
        let playerTeamA 
        playerTeamA = this.props.match.teams.faction1.roster[p].nickname
        let newPromiseA = axios.get(backlink + "api/statistics/?nickname_player=" + playerTeamA)
        axiosArrayStatsPlayers.push(newPromiseA)
      }

      for(var w = 0; w < 5 ; w++){
        let playerTeamB 
        playerTeamB = this.props.match.teams.faction2.roster[w].nickname
        let newPromiseB = axios.get(backlink + "api/statistics/?nickname_player=" + playerTeamB)
        axiosArrayStatsPlayers.push(newPromiseB)
      }

      axios.all(axiosArrayStatsPlayers)
        .then(axios.spread((...responses) => {


          let axiosArrayStatsPlayersAnswer = []

          responses.forEach(res => {
            axiosArrayStatsPlayersAnswer.push(res.data)
          })


          this.setState({ 
            data: axiosArrayStatsPlayersAnswer
          });


        }
          
          
          
        ))

      

             



    }






    render() {
        return (
            <>


                <Button size="sm" className='match_info_button text-nowrap' onClick={() => this.enable()}>Statystyki</Button>

                <Modal
                    show={this.state.show}
                    onHide={() => this.setState({ show: false})}
                    dialogClassName="modal-80w"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">Statystyki graczy w meczu "{this.props.match.teams.faction1.name}" vs "{this.props.match.teams.faction2.name}"</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>

                  
                    <Row>
                      
                      <Col xs={6}>

                        <Row>
                          <Col xs={2}>
                            <Container className="container_stats_players text-nowrap">
                              <img className="avatar_stats_img_match" src={this.props.match.teams.faction1.roster[0].avatar ? this.props.match.teams.faction1.roster[0].avatar : defaultUser}></img>
                              <a >{this.props.match.teams.faction1.roster[0].nickname}</a> 
                              <img className="lvl_stats_img_match" src={imgURL[this.props.match.teams.faction1.roster[0].game_skill_level]}></img> 
                              
                            </Container>
                          </Col>
                          <Col >

                            <LineChart
                              width={600}
                              height={150}
                              data={this.state.data[0]}
                              margin={{
                                  top: 15,
                                  right: 30,
                                  left: 20,
                                  bottom: 5
                              }}
                              >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="win" tick={{fontSize: 10}}/>
                              <YAxis domain={[0, 3]} allowDataOverflow={true} tickCount={4}/>
                              <Tooltip content={<CustomTooltip />} />
                              <Line
                                  type="monotone"
                                  dataKey="kd"
                                  stroke="#8884d8"
                                  activeDot={{ r: 5 }}
                              />
                              <Line type="monotone" dataKey="kr" stroke="#82ca9d" />
                            </LineChart>
                          </Col>
                        </Row>





                        <Row>
                          <Col xs={2}>
                            <Container className="container_stats_players text-nowrap">
                                <img className="avatar_stats_img_match" src={this.props.match.teams.faction1.roster[1].avatar ? this.props.match.teams.faction1.roster[1].avatar : defaultUser}></img>
                                <a >{this.props.match.teams.faction1.roster[1].nickname}</a> 
                                <img className="lvl_stats_img_match" src={imgURL[this.props.match.teams.faction1.roster[1].game_skill_level]}></img> 
                                
                            </Container>

                          </Col>
                          <Col >

                          <LineChart
                            width={600}
                            height={150}
                            data={this.state.data[1]}
                            margin={{
                                top: 15,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="win" tick={{fontSize: 10}} />
                            <YAxis domain={[0, 3]} allowDataOverflow={true} tickCount={4}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="kd"
                                stroke="#8884d8"
                                activeDot={{ r: 5 }}
                            />
                            <Line type="monotone" dataKey="kr" stroke="#82ca9d" />
                          </LineChart>







                          </Col>
                        </Row>



                      


                        <Row>
                          <Col xs={2}>
                            <Container className="container_stats_players text-nowrap">
                                <img className="avatar_stats_img_match" src={this.props.match.teams.faction1.roster[2].avatar ? this.props.match.teams.faction1.roster[2].avatar : defaultUser}></img>
                                <a >{this.props.match.teams.faction1.roster[2].nickname}</a> 
                                <img className="lvl_stats_img_match" src={imgURL[this.props.match.teams.faction1.roster[2].game_skill_level]}></img> 
                                
                            </Container>

                          </Col>
                          <Col >

                          <LineChart
                            width={600}
                            height={150}
                            data={this.state.data[2]}
                            margin={{
                                top: 15,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="win" tick={{fontSize: 10}} />
                            <YAxis domain={[0, 3]} allowDataOverflow={true} tickCount={4}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="kd"
                                stroke="#8884d8"
                                activeDot={{ r: 5 }}
                            />
                            <Line type="monotone" dataKey="kr" stroke="#82ca9d" />
                          </LineChart>


                          
                          </Col>
                        </Row>








                        <Row>
                          <Col xs={2}>
                            <Container className="container_stats_players text-nowrap">
                                <img className="avatar_stats_img_match" src={this.props.match.teams.faction1.roster[3].avatar ? this.props.match.teams.faction1.roster[3].avatar : defaultUser}></img>
                                <a >{this.props.match.teams.faction1.roster[3].nickname}</a> 
                                <img className="lvl_stats_img_match" src={imgURL[this.props.match.teams.faction1.roster[3].game_skill_level]}></img> 
                                
                            </Container>

                          </Col>
                          <Col >

                          <LineChart
                            width={600}
                            height={150}
                            data={this.state.data[3]}
                            margin={{
                                top: 15,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="win" tick={{fontSize: 10}} />
                            <YAxis domain={[0, 3]} allowDataOverflow={true} tickCount={4}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="kd"
                                stroke="#8884d8"
                                activeDot={{ r: 5 }}
                            />
                            <Line type="monotone" dataKey="kr" stroke="#82ca9d" />
                          </LineChart>

                          </Col>
                        </Row>



                        






                        <Row>
                          <Col xs={2}>
                            <Container className="container_stats_players text-nowrap">
                                <img className="avatar_stats_img_match" src={this.props.match.teams.faction1.roster[4].avatar ? this.props.match.teams.faction1.roster[4].avatar : defaultUser}></img>
                                <a >{this.props.match.teams.faction1.roster[4].nickname}</a> 
                                <img className="lvl_stats_img_match" src={imgURL[this.props.match.teams.faction1.roster[4].game_skill_level]}></img> 
                                
                            </Container>

                          </Col>
                          <Col >

                          <LineChart
                            width={600}
                            height={174}
                            data={this.state.data[4]}
                            margin={{
                                top: 15,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="win" tick={{fontSize: 10}} />
                            <YAxis domain={[0, 3]} allowDataOverflow={true} tickCount={4}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="kd"
                                stroke="#8884d8"
                                activeDot={{ r: 5 }}
                            />
                            <Line type="monotone" dataKey="kr" stroke="#82ca9d" />
                          </LineChart>






                          
                          </Col>
                        </Row>




                        


                      </Col>




                      <Col xs={6}>


                      <Row>
                        <Col>

                        <LineChart
                            width={600}
                            height={150}
                            data={this.state.data[5]}
                            margin={{
                                top: 15,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="win" tick={{fontSize: 10}} />
                            <YAxis domain={[0, 3]} allowDataOverflow={true} tickCount={4}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="kd"
                                stroke="#8884d8"
                                activeDot={{ r: 5 }}
                            />
                            <Line type="monotone" dataKey="kr" stroke="#82ca9d" />
                          </LineChart>

                        </Col>
                        <Col xs={2}>
                          <Container className="container_stats_players text-nowrap">
                                <img className="avatar_stats_img_match" src={this.props.match.teams.faction2.roster[0].avatar ? this.props.match.teams.faction2.roster[0].avatar : defaultUser}></img>
                                <a >{this.props.match.teams.faction2.roster[0].nickname}</a> 
                                <img className="lvl_stats_img_match" src={imgURL[this.props.match.teams.faction2.roster[0].game_skill_level]}></img> 
                                
                            </Container>

                        </Col>

                      </Row>



                      




                      <Row>
                        <Col>
                          <LineChart
                            width={600}
                            height={150}
                            data={this.state.data[6]}
                            margin={{
                                top: 15,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="win" tick={{fontSize: 10}} />
                            <YAxis domain={[0, 3]} allowDataOverflow={true} tickCount={4}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="kd"
                                stroke="#8884d8"
                                activeDot={{ r: 5 }}
                            />
                            <Line type="monotone" dataKey="kr" stroke="#82ca9d" />
                          </LineChart>


                        </Col>
                        <Col xs={2}>
                          <Container className="container_stats_players text-nowrap">
                                <img className="avatar_stats_img_match" src={this.props.match.teams.faction2.roster[1].avatar ? this.props.match.teams.faction2.roster[1].avatar : defaultUser}></img>
                                <a >{this.props.match.teams.faction2.roster[1].nickname}</a> 
                                <img className="lvl_stats_img_match" src={imgURL[this.props.match.teams.faction2.roster[1].game_skill_level]}></img> 
                                
                            </Container>

                        </Col>

                      </Row>


                        



                      <Row>
                        <Col>
                          <LineChart
                            width={600}
                            height={150}
                            data={this.state.data[7]}
                            margin={{
                                top: 15,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="win" tick={{fontSize: 10}} />
                            <YAxis domain={[0, 3]} allowDataOverflow={true} tickCount={4}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="kd"
                                stroke="#8884d8"
                                activeDot={{ r: 5 }}
                            />
                            <Line type="monotone" dataKey="kr" stroke="#82ca9d" />
                          </LineChart>

                        </Col>
                        <Col xs={2}>
                          <Container className="container_stats_players text-nowrap">
                                <img className="avatar_stats_img_match" src={this.props.match.teams.faction2.roster[2].avatar ? this.props.match.teams.faction2.roster[2].avatar : defaultUser}></img>
                                <a >{this.props.match.teams.faction2.roster[2].nickname}</a> 
                                <img className="lvl_stats_img_match" src={imgURL[this.props.match.teams.faction2.roster[2].game_skill_level]}></img> 
                                
                            </Container>

                        </Col>

                      </Row>



                        


                      <Row>
                        <Col>
                          <LineChart
                            width={600}
                            height={150}
                            data={this.state.data[8]}
                            margin={{
                                top: 15,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="win" tick={{fontSize: 10}} />
                            <YAxis domain={[0, 3]} allowDataOverflow={true} tickCount={4}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="kd"
                                stroke="#8884d8"
                                activeDot={{ r: 5 }}
                            />
                            <Line type="monotone" dataKey="kr" stroke="#82ca9d" />
                          </LineChart>

                        </Col>
                        <Col xs={2}>
                          <Container className="container_stats_players text-nowrap">
                                <img className="avatar_stats_img_match" src={this.props.match.teams.faction2.roster[3].avatar ? this.props.match.teams.faction2.roster[3].avatar : defaultUser}></img>
                                <a >{this.props.match.teams.faction2.roster[3].nickname}</a> 
                                <img className="lvl_stats_img_match" src={imgURL[this.props.match.teams.faction2.roster[3].game_skill_level]}></img> 
                                
                            </Container>

                        </Col>

                      </Row>



                        



                      <Row>
                        <Col>
                          <LineChart
                            width={600}
                            height={174}
                            data={this.state.data[9]}
                            margin={{
                                top: 15,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="win" tick={{fontSize: 10}} />
                            <YAxis domain={[0, 3]} allowDataOverflow={true} tickCount={4}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="kd"
                                stroke="#8884d8"
                                activeDot={{ r: 5 }}
                            />
                            <Line type="monotone" dataKey="kr" stroke="#82ca9d" />
                          </LineChart>

                        </Col>
                        <Col xs={2}>
                          <Container className="container_stats_players text-nowrap">
                                <img className="avatar_stats_img_match" src={this.props.match.teams.faction2.roster[4].avatar ? this.props.match.teams.faction2.roster[4].avatar : defaultUser}></img>
                                <a >{this.props.match.teams.faction2.roster[4].nickname}</a> 
                                <img className="lvl_stats_img_match" src={imgURL[this.props.match.teams.faction2.roster[4].game_skill_level]}></img> 
                                
                            </Container>

                        </Col>

                      </Row>




                        





                      </Col>


                      
                      


                      
                    </Row>
                    


                    
















                  </Modal.Body>
                </Modal>
            </>





        )
    }
}