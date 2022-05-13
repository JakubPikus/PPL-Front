import React from 'react';
import axios from 'axios';
import { Card, Button, Col, Container, Row } from 'react-bootstrap';
import '../MatchList.css';
import Lvl10 from '../images/faceit10.svg';
import Lvl9 from '../images/faceit9.svg';
import Lvl8 from '../images/faceit8.svg';
import Lvl7 from '../images/faceit7.svg';
import Lvl6 from '../images/faceit6.svg';
import defaultUser from '../images/defaultuser.png';
import faceitProfile from '../images/user.png';
import ClipLoader from "react-spinners/ClipLoader";
import _ from "lodash";


export default class MatchList extends React.Component {
  state = {
    isLoaded: false,
    matches: [],
    playersElo: []
  }
  

  componentDidMount() {
    this.getMatches();
    this.interval = setInterval(this.getMatches, 5000)

  }

  getMatches = () => {

    //Zapętlone pobieranie wyników meczów

    axios.get(`https://open.faceit.com/data/v4/hubs/18d8cc72-e76a-43f0-bbd3-ca7cf48a6115/matches?type=ongoing`, {
      headers: {
        'Authorization': 'Bearer d0f23c73-6216-44c3-bab7-8f458184a942'

      }
      })
    .then(res => {
      const newMatches = res.data.items 
      let matches = this.state.matches

      //Sprawdzenie między obecnym state a nowymi danami czy nie ma różnicy między id meczów do sprawdzenia czy dodać jakiś nowy mecz czy jakiś usunąć (wyjątek check_in ponieważ nie ma odpowiedzi do graczy w meczu)
      
      if(JSON.stringify(newMatches.map(function(e) {if(e.status !== "CHECK_IN"){return e.match_id}})) !== JSON.stringify(matches.map(function(e) {if(e.status !== "CHECK_IN"){return e.match_id}}))) {


        //Jak IF -> true to znaczy że są różne mecze
        //console.log("CATCH - różne mecze")



        var oldId = []
        var newId = []
        var players = _.cloneDeep(this.state.playersElo) //pobranie aktualnej listy state playerów z elo, cloneDeep bo inaczej setState nie działa do usuwania elementów




        //Odfiltrowanie jakie id meczów pojawiły się nowe (newId), a które znikły (oldId) 

        newMatches.map(e => newId.push(e.match_id))
        matches.map(e => oldId.push(e.match_id))
        let newIdTemp = newId
        newId = newId.filter( el => oldId.indexOf( el ) < 0)
        oldId = oldId.filter( el => newIdTemp.indexOf( el ) < 0)

        
        //console.log("------- 1. -------")
        //console.log("mecz do dodania")
        //console.log(newId)
        //console.log("mecz do usuniecia")
        //console.log(oldId)




        //console.log("------- 2. -------")


        //Sprawdzenie przypadku różnicy id meczów dla pojawienia się nowego meczu
        if(newId.length > 0){

          //Sprawdzenie przypadku różnicy id meczów dla pojawienia się nowego meczu
          //console.log("rozpoczynanie dodawania elo")


          for(var i = 0; i < newMatches.length; i++ ){

            for(var j = 0; j < newId.length; j++){

              //Dojście do konkretnego meczu z zapętlonej odpowiedzi axios, który pojawił się nowy

              if(newMatches[i].match_id === newId[j]){

                //console.log("ACC")
                
                //Dodanie wszystkich graczy nowego meczu do listy players w formacie [id,nick,elo]

                for(var p = 0; p < 5 ; p++){

                  let playerTeamA = [newMatches[i].match_id ,newMatches[i].teams.faction1.roster[p].nickname]
                  let playerTeamB = [newMatches[i].match_id ,newMatches[i].teams.faction2.roster[p].nickname]

                  //pobranie elo nowych zawodników
                  axios.get(`https://open.faceit.com/data/v4/players?nickname=` + newMatches[i].teams.faction1.roster[p].nickname, {
                    headers: {
                      'Authorization': 'Bearer d0f23c73-6216-44c3-bab7-8f458184a942'
                    }
                    }).then(res => {
                      const playerElo = res.data.games.csgo.faceit_elo
                      playerTeamA.push(playerElo)
                    })

                  axios.get(`https://open.faceit.com/data/v4/players?nickname=` + newMatches[i].teams.faction2.roster[p].nickname, {
                    headers: {
                      'Authorization': 'Bearer d0f23c73-6216-44c3-bab7-8f458184a942'
                    }
                    }).then(res => {
                      const playerElo = res.data.games.csgo.faceit_elo
                      playerTeamB.push(playerElo)
                    })

                  players.push(playerTeamA)
                  players.push(playerTeamB)
                }
                
                //console.log(players)
                //console.log("NEXT")

              }
            }
          }
        }

        //Sprawdzenie przypadku różnicy id meczów dla zniknięcia/zakończenia meczu

        if(oldId.length > 0){

          //console.log("rozpoczynanie usuwania elo")
          //console.log(players)

          //odfiltrowanie tablicy players z elementów, które nie pojawiły się w nowej odpowiedzi od faceita

          players = players.filter(el => oldId.indexOf(el[0]) < 0)
          //console.log(players) 
        }
        //Zapisanie danych do state
        this.setState({ 
          playersElo : players //?
        });

      }
      //else {
       //console.log(this.state.playersElo)
       //console.log("CATCH - te same mecze")

      //}

      //Zapisanie do state zapętlonych nowych wyników meczów

      this.setState({ 
        isLoaded: true,
        matches : newMatches
      });
    })
  }

  getEloPlayer = (props) => {

    if(this.state.playersElo.filter(el => el[1] === props).length !== 0){
      const elo = this.state.playersElo.filter(el => el[1] === props)
      return elo[0][2] 
    }
  }

  getMathEloWinLose = (props1,props2) => {

    let differenceElo = props1 - props2

    

    if(differenceElo < 0){

      if(differenceElo > -20){
        return ["+25","-25"]
      }

      else if(differenceElo <= -20 && differenceElo>= -40){
        return ["+26","-24"]
      }

      else if(differenceElo < -40 && differenceElo >= -50){
        return ["+27","-23"]
      }

      else if(differenceElo < -50 && differenceElo >= -60){
        return ["+28","-22"]
      }

      else if(differenceElo < -60 && differenceElo >= -70){
        return ["+29","-21"]
      }

      else if(differenceElo < -70 && differenceElo >= -80){
        return ["+30","-20"]
      }

      else if(differenceElo < -80 && differenceElo >= -90){
        return ["+31","-19"]
      }

      else if(differenceElo < -90 && differenceElo >= -100){
        return ["+32","-18"]
      }

      else if(differenceElo < -100 && differenceElo >= -115){
        return ["+33","-17"]
      }

      else if(differenceElo < -115 && differenceElo >= -130){
        return ["+34","-16"]
      }

      else if(differenceElo < -130 && differenceElo >= -145){
        return ["+35","-15"]
      }

      else if(differenceElo < -145 && differenceElo >= -160){
        return ["+36","-14"]
      }

      else if(differenceElo < -160 && differenceElo >= -175){
        return ["+37","-13"]
      }

      else if(differenceElo < -175 && differenceElo >= -190){
        return ["+38","-12"]
      }

      else if(differenceElo < -190 && differenceElo >= -230){
        return ["+39","-11"]
      }


      else if(differenceElo < -230 && differenceElo >= -260){
        return ["+40","-10"]
      }

      else if(differenceElo < -260){
        return ["wiecej niż +40","wiecej niż -10"]
      }
      
    }
    else if(differenceElo > 0){


      if(differenceElo < 20){
        return ["+25","-25"]
      }

      else if(differenceElo >= 20 && differenceElo<=40){
        return ["+24","-26"]
      }

      else if(differenceElo > 40 && differenceElo<=50){
        return ["+23","-27"]
      }

      else if(differenceElo > 50 && differenceElo<=60){
        return ["+22","-28"]
      }

      else if(differenceElo > 60 && differenceElo<=70){
        return ["+21","-29"]
      }

      else if(differenceElo > 70 && differenceElo<=80){
        return ["+20","-30"]
      }

      else if(differenceElo > 80 && differenceElo<=90){
        return ["+19","-31"]
      }

      else if(differenceElo > 90 && differenceElo<=100){
        return ["+18","-32"]
      }

      else if(differenceElo > 100 && differenceElo<=115){
        return ["+17","-33"]
      }

      else if(differenceElo > 115 && differenceElo<=130){
        return ["+16","-34"]
      }

      else if(differenceElo > 130 && differenceElo<=145){
        return ["+15","-35"]
      }

      else if(differenceElo > 145 && differenceElo<=160){
        return ["+14","-36"]
      }


      else if(differenceElo > 160 && differenceElo<=175){
        return ["+13","-37"]
      }

      else if(differenceElo > 175 && differenceElo<=190){
        return ["+12","-38"]
      }

      else if(differenceElo > 190 && differenceElo<=230){
        return ["+11","-39"]
      }

      else if(differenceElo > 230 && differenceElo<=260){
        return ["+10","-40"]
      }

      else if(differenceElo > 260){
        return ["mniej niż +10","mniej niż -40"]
      }

    }
    else if(differenceElo === 0){
      return ["+25","-25"]

    }
  }




  getMathAvgEloTeams = (props) => {

    let avgEloTeamA = 0

    let avgEloTeamB = 0

    let arrayMatch = this.state.playersElo.filter(el => el[0] === props.match_id)

    let arrayTeamA = arrayMatch.filter(function(el){


    for(let i = 0; i < 5; i++){

      if(el[1] === props.teams.faction1.roster[i].nickname){
        return el[1] === props.teams.faction1.roster[i].nickname
      }
    }
    })

    let arrayTeamB = arrayMatch.filter(function(el){


      for(let i = 0; i < 5; i++){
  
        if(el[1] === props.teams.faction2.roster[i].nickname){
          return el[1] === props.teams.faction2.roster[i].nickname
        }
      }
      })

    for(let o = 0; o < arrayTeamA.length; o++){
      avgEloTeamA += arrayTeamA[o][2]/5
      
    }

    for(let o = 0; o < arrayTeamB.length; o++){
      avgEloTeamB += arrayTeamB[o][2]/5
      
    }

    let avgEloCeilTeamA = Math.ceil(avgEloTeamA)

    let avgEloCeilTeamB = Math.ceil(avgEloTeamB)

    return [avgEloCeilTeamA, avgEloCeilTeamB]

  }


 


  getEloTeamA = (props) => {

    let data = this.getMathAvgEloTeams(props)

    const avarageElo = data[0]
    const avarageEloOppTeam = data[1]

    return <div>

    {!(isNaN(avarageElo)) && 
      <Container className='container_match_elo elomatchteama'>
        <a className='elo_match'>Średnie ELO - {avarageElo}</a>
        <Row>
          <Col>
            <a className='elo_match' style={{ color: "green"}}>{this.getMathEloWinLose(avarageElo, avarageEloOppTeam)[0]}</a>
            <a className='elo_match'> / </a>
            <a className='elo_match' style={{ color: "red"}}>{this.getMathEloWinLose(avarageElo, avarageEloOppTeam)[1]}</a>
          </Col>
        </Row>
      </Container>}

    {isNaN(avarageElo) && <ClipLoader color="#00BFFF" size={63} />}


    </div>
  }

  getEloTeamB = (props) => {

    let data = this.getMathAvgEloTeams(props)

    const avarageElo = data[1]
    const avarageEloOppTeam = data[0]


    return <div>

    {!(isNaN(avarageElo)) &&
    <Container className='container_match_elo containermatchelob'>
        <a className='elo_match'>Średnie ELO - {avarageElo}</a>
        <Row>
          <Col>
            <a className='elo_match' style={{ color: "green"}}>{this.getMathEloWinLose(avarageElo, avarageEloOppTeam)[0]}</a>
            <a className='elo_match'> / </a>
            <a className='elo_match' style={{ color: "red"}}>{this.getMathEloWinLose(avarageElo, avarageEloOppTeam)[1]}</a>
          </Col>
        </Row>
      </Container>}

      {isNaN(avarageElo) && <ClipLoader color="#00BFFF" size={63} />}


    </div>
  }



  matchInfo = (props) => {
    let localization = {
      "Germany": 0,
      "France": 1,
      "Poland": 2
    }

    let map = {
      "de_train": 0,
      "de_inferno": 1,
      "de_vertigo": 2,
      "de_ancient": 3,
      "de_dust2": 4,
      "de_mirage": 5,
      "de_nuke": 6,
      "de_overpass": 7,
      "de_cache": 8
    }

    if (props.status === "READY") {
      return <Container className="mt-2 container_match_info">
          <Button size="sm" className='match_info_button text-nowrap' variant="dark" href={props.faceit_url.replace('{lang}', 'pl')}>Faceit Room</Button>
          <a className='match_info'>0 : 0</a>
          <img src={props.voting.location.entities[localization[props.voting.location.pick]].image_sm} className='match_info_img' style={{borderStyle: "ridge" }}></img>
          <a className='match_info matchinfomap'>{props.voting.map.pick}</a>
          <img src={props.voting.map.entities[map[props.voting.map.pick]].image_sm} className='match_info_img'></img>
        </Container>;
    } 
    else if (props.status === "ONGOING") {
      try{
      return <Container className="mt-2 container_match_info">
        <Button size="sm" className='match_info_button text-nowrap' variant="dark" href={props.faceit_url.replace('{lang}', 'pl')}>Faceit Room</Button>
        <a className='match_info'>{props.results.score.faction1 ? props.results.score.faction1 : "0" } : {props.results.score.faction2 ? props.results.score.faction2 : "0"}</a>
        <img src={props.voting.location.entities[localization[props.voting.location.pick]].image_sm} className='match_info_img' style={{borderStyle: "ridge" }}></img>
        <a className='match_info matchinfomap'>{props.voting.map.pick}</a>
        <img src={props.voting.map.entities[map[props.voting.map.pick]].image_sm} className='match_info_img'></img>
      </Container>;
      }
      catch(TypeError){
        return <Container className="mt-2 container_match_info">
            <Button size="sm" className='match_info_button text-nowrap' variant="dark" href={props.faceit_url.replace('{lang}', 'pl')}>Faceit Room</Button>
            <a className='match_info'>0 : 0</a>
            <img src={props.voting.location.entities[localization[props.voting.location.pick]].image_sm} className='match_info_img' style={{ borderStyle: "ridge" }}></img>
            <a className='match_info matchinfomap'>{props.voting.map.pick}</a>
            <img src={props.voting.map.entities[map[props.voting.map.pick]].image_sm} className='match_info_img'></img>
          </Container>;
      }
    }
    else if (props.status === "CHECK_IN") {
      return <Container className="mt-2 container_notready_match_info text-wrap">
        <Button size="sm" className='match_info_button text-nowrap mt-1' variant="dark" href={props.faceit_url.replace('{lang}', 'pl')}>Faceit Room</Button>
        <a className='match_info mt-3'>Akceptowanie nowego meczu</a>
      </Container>;
    }
    else if (props.status === "VOTING") {
      return <Container className="mt-2 container_notready_match_info text-wrap">
          <Button size="sm" className='match_info_button text-nowrap mt-1' variant="dark" href={props.faceit_url.replace('{lang}', 'pl')}>Faceit Room</Button>
          <a className='match_info mt-3' style={{wordWrap: 'normal'}}>Pickowanie mapy</a>
        </Container>;
    }
    else if (props.status === "CAPTAIN_PICK") {
      return <Container className="mt-2 container_notready_match_info text-wrap">
        <Button size="sm" className='match_info_button text-nowrap mt-1' variant="dark" href={props.faceit_url.replace('{lang}', 'pl')}>Faceit Room</Button>
        <a className='match_info mt-3' style={{wordWrap: 'normal'}}>Pickowanie drużyny</a>
      </Container>;
    }
    else if (props.status === "CONFIGURING") {
      return  <Container className="mt-2 container_notready_match_info text-wrap">
        <Button size="sm" className='match_info_button text-nowrap mt-1' variant="dark" href={props.faceit_url.replace('{lang}', 'pl')}>Faceit Room</Button>
        <a className='match_info mt-3' style={{wordWrap: 'normal'}}>Konfigurowanie serwera</a>
      </Container>;
    }
    else if (props.status === "CANCELED") {
      return  <Container className="mt-2 container_notready_match_info text-wrap">
          <Button size="sm" className='match_info_button text-nowrap mt-1' variant="dark" href={props.faceit_url.replace('{lang}', 'pl')}>Faceit Room</Button>
          <a className='match_info mt-3' style={{wordWrap: 'normal'}}>Anulowane</a>
        </Container>;
    }
    else {
      return <h5>Błąd, prosze o info o tym przypadku na pw faceit MBBN-BADBOYS</h5>;
    }
  }




  rosterTeamA = (props) => {
    let imgURL = {
      10: Lvl10,
      9: Lvl9,
      8: Lvl8,
      7: Lvl7,
      6: Lvl6
    }

    if (props.status === "CHECK_IN"){
      return 
    }
    else {
      return props.teams.faction1.roster.map(players =>{
        return <Row className="flex-nowrap">
          <Col xs={2}><img src={players.avatar ? players.avatar : defaultUser} className='avatar_img_match'></img></Col>
          <Col xs={4}><a className='font_match fontmatchplayer'>{players.nickname}</a></Col>
          <Col xs={2}><img src={imgURL[players.game_skill_level]} className='lvl_img_match'></img></Col>
          <Col xs={1}><a href={"https://www.faceit.com/pl/players/" + players.nickname}><img src={faceitProfile} className='faceit_profile_img_match'></img></a></Col>
          <Col xs={3}><a className='font_match matcheloteama'>{this.getEloPlayer(players.nickname)}</a></Col>
        </Row>
      })
    }
  }


  rosterTeamB = (props) => {
    let imgURL = {
      10: Lvl10,
      9: Lvl9,
      8: Lvl8,
      7: Lvl7,
      6: Lvl6
    }

    if (props.status === "CHECK_IN"){
      return 
    }
    else {
      return props.teams.faction2.roster.map(players =>{
        return <Row className="flex-nowrap">
          <Col xs={3}><a className='font_match'>{this.getEloPlayer(players.nickname)}</a></Col>
          <Col xs={1}><a href={"https://www.faceit.com/pl/players/" + players.nickname}><img src={faceitProfile} className='faceit_profile_img_match'></img></a></Col>
          <Col xs={2}><img src={imgURL[players.game_skill_level]} className='lvl_img_match'></img></Col>
          <Col xs={4}><a className='font_match fontmatchplayer'>{players.nickname}</a></Col>
          <Col xs={2}><img src={players.avatar ? players.avatar : defaultUser} className='avatar_img_match avatarimgmatchb'></img></Col>
        </Row>
      })
    }
  }

  teamA = (props) => {
    if (props.status === "CHECK_IN"){
      return
    }
    else if(props.status === "CAPTAIN_PICK"){
      return <div>
        <a className='team_name teamnamea'>{props.teams.faction1.name}</a>
        {this.rosterTeamA(props)}
      </div>
    }
    else {
      return <div>
        <a className='team_name teamnamea'>{props.teams.faction1.name}</a>
        {this.getEloTeamA(props)}
        {this.rosterTeamA(props)}
      </div>
    }
    
  }

  teamB = (props) => {
    if (props.status === "CHECK_IN"){
      return 
    }
    else if(props.status === "CAPTAIN_PICK"){
      return <div>
      <a className='team_name teamnameb'>{props.teams.faction2.name}</a>
      {this.rosterTeamB(props)}
    </div>
    }
    else {
      return <div>
        <a className='team_name teamnameb'>{props.teams.faction2.name}</a>
        {this.getEloTeamB(props)}
        {this.rosterTeamB(props)}
      </div>
    }
  }

  render() {

    const { isLoaded, matches } = this.state;

    if (!isLoaded) {
      return <ClipLoader color="#00BFFF" size={100} />
    } 

    else {
      return (
        <div>
          {matches.length === 0 && <h3>Aktualnie brak meczów</h3>}
          <ul>
            {matches.map(match =>
              <li key={match.id}>
                <Card className="mt-5 text-nowrap">
                  <Card.Body className='card_body' style={{padding: "0.5rem"}}>
                      <Container fluid style={{ color: 'black' }}>
                          <Row>
                              <Col xs={5}>
                              {this.teamA(match)}
                              </Col>

                              <Col xs={2}>
                                  
                                  {this.matchInfo(match)}
                              </Col>

                              <Col xs={5}>
                              {this.teamB(match)}
                              </Col>
                          </Row>
                      </Container>
                  </Card.Body>
                </Card>
              </li>
            )}
          </ul>
        </div>
      )
    }
  }
}