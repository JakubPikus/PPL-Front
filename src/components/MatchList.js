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

              if(newMatches[i].match_id == newId[j]){

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
      else {
       //console.log(this.state.playersElo)
       //console.log("CATCH - te same mecze")

      }

      //Zapisanie do state zapętlonych nowych wyników meczów

      this.setState({ 
        isLoaded: true,
        matches : newMatches
      });
    })
  }

  getEloPlayer = (props) => {

    if(this.state.playersElo.filter(el => el[1] == props).length !== 0){
      const elo = this.state.playersElo.filter(el => el[1] == props)
      return elo[0][2] 
    }
  }

  getMathEloWinLose = (props1,props2) => {

    let differenceElo = props1 - props2


    if(differenceElo < 0){

      if(differenceElo > -20){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+25</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-25</a>
        </div>
      }

      else if(differenceElo <= -20 && differenceElo>= -40){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+26</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-24</a>
        </div>
      }

      else if(differenceElo < -40 && differenceElo >= -50){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+27</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-23</a>
        </div>
      }

      else if(differenceElo < -50 && differenceElo >= -60){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+28</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-22</a>
        </div>
      }

      else if(differenceElo < -60 && differenceElo >= -70){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+29</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-21</a>
        </div>
      }

      else if(differenceElo < -70 && differenceElo >= -80){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+30</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-20</a>
        </div>
      }

      else if(differenceElo < -80 && differenceElo >= -90){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+31</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-19</a>
        </div>
      }

      else if(differenceElo < -90 && differenceElo >= -100){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+32</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-18</a>
        </div>
      }

      else if(differenceElo < -100 && differenceElo >= -115){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+33</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-17</a>
        </div>
      }

      else if(differenceElo < -115 && differenceElo >= -130){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+34</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-16</a>
        </div>
      }

      else if(differenceElo < -130 && differenceElo >= -145){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+35</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-15</a>
        </div>
      }

      else if(differenceElo < -145 && differenceElo >= -160){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+36</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-14</a>
        </div>
      }

      else if(differenceElo < -160 && differenceElo >= -175){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+37</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-13</a>
        </div>
      }

      else if(differenceElo < -175 && differenceElo >= -190){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+38</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-12</a>
        </div>
      }

      else if(differenceElo < -190 && differenceElo >= -230){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+39</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-11</a>
        </div>
      }


      else if(differenceElo < -230 && differenceElo >= -260){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+40</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-10</a>
        </div>
      }

      else if(differenceElo < -260){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>wiecej niż +40</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>wiecej niż -10</a>
        </div>
      }
      
    }
    else if(differenceElo > 0){


      if(differenceElo < 20){
      return <div>
        <a style={{ fontSize: "13px", color: "green"}}>+25</a>
        <a style={{ fontSize: "13px"}}> / </a>
        <a style={{ fontSize: "13px", color: "red"}}>-25</a>
      </div>
      }

      else if(differenceElo >= 20 && differenceElo<=40){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+24</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-26</a>
        </div>
      }

      else if(differenceElo > 40 && differenceElo<=50){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+23</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-27</a>
        </div>
      }

      else if(differenceElo > 50 && differenceElo<=60){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+22</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-28</a>
        </div>
      }

      else if(differenceElo > 60 && differenceElo<=70){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+21</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-29</a>
        </div>
      }

      else if(differenceElo > 70 && differenceElo<=80){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+20</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-30</a>
        </div>
      }

      else if(differenceElo > 80 && differenceElo<=90){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+19</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-31</a>
        </div>
      }

      else if(differenceElo > 90 && differenceElo<=100){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+18</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-32</a>
        </div>
      }

      else if(differenceElo > 100 && differenceElo<=115){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+17</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-33</a>
        </div>
      }

      else if(differenceElo > 115 && differenceElo<=130){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+16</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-34</a>
        </div>
      }

      else if(differenceElo > 130 && differenceElo<=145){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+15</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-35</a>
        </div>
      }

      else if(differenceElo > 145 && differenceElo<=160){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+14</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-36</a>
        </div>
      }


      else if(differenceElo > 160 && differenceElo<=175){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+13</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-37</a>
        </div>
      }

      else if(differenceElo > 175 && differenceElo<=190){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+12</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-38</a>
        </div>
      }

      else if(differenceElo > 190 && differenceElo<=230){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+11</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-39</a>
        </div>
      }

      else if(differenceElo > 230 && differenceElo<=260){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>+10</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>-40</a>
        </div>
      }

      else if(differenceElo > 260){
        return <div>
          <a style={{ fontSize: "13px", color: "green"}}>mniej niż +10</a>
          <a style={{ fontSize: "13px"}}> / </a>
          <a style={{ fontSize: "13px", color: "red"}}>mniej niż -40</a>
        </div>
      }




      
    }
    else if(differenceElo == 0){
      return <div>
        <a style={{ fontSize: "13px", color: "green"}}>+25</a>
        <a style={{ fontSize: "13px"}}> / </a>
        <a style={{ fontSize: "13px", color: "red"}}>-25</a>
      </div>

    }


  }




  getMathAvgEloTeams = (props) => {

    let avgEloTeamA = 0

    let avgEloTeamB = 0

    let arrayMatch = this.state.playersElo.filter(el => el[0] == props.match_id)

    let arrayTeamA = arrayMatch.filter(function(el){


    for(let i = 0; i < 5; i++){

      if(el[1] == props.teams.faction1.roster[i].nickname){
        return el[1] == props.teams.faction1.roster[i].nickname
      }
    }
    })

    let arrayTeamB = arrayMatch.filter(function(el){


      for(let i = 0; i < 5; i++){
  
        if(el[1] == props.teams.faction2.roster[i].nickname){
          return el[1] == props.teams.faction2.roster[i].nickname
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
      <div style={{marginTop: -10}}> 
        {!(isNaN(avarageElo)) && <a style={{ fontSize: "13px"}}>Średnie ELO - {avarageElo}</a>}
      </div>
      <br></br>
      <div style={{marginTop: -50}}>
        {this.getMathEloWinLose(avarageElo, avarageEloOppTeam)}
      </div>
    </div>

  }

  getEloTeamB = (props) => {

    let data = this.getMathAvgEloTeams(props)

    const avarageElo = data[1]
    const avarageEloOppTeam = data[0]


    return <div>
      <div style={{marginTop: -10}}>  
        {!(isNaN(avarageElo)) && <a style={{ fontSize: "13px"}}>Średnie ELO - {avarageElo}</a>}
      </div>
      <br></br>
      <div style={{marginTop: -50}}> 
        {this.getMathEloWinLose(avarageElo, avarageEloOppTeam)}
      </div>
    </div>
  }



  matchInfo = (props) => {
    if (props.status === "READY") {
      return <div>

        <div >
          <h5>0 : 0</h5>
        </div>

        <br></br>

        <div >
            <h5>{props.voting.location.pick ? props.voting.location.pick : ""}</h5>
        </div>

        <br></br>

        <div>
            <h5>{props.voting.map.pick ? props.voting.map.pick : ""}</h5>
        </div>

      </div>;
    } 
    else if (props.status === "ONGOING") {
      try{
      return <div>

        <div >
          <h5>{props.results.score.faction1 ? props.results.score.faction1 : "0" } : {props.results.score.faction2 ? props.results.score.faction2 : "0"}</h5>
        </div>

        <br></br>

        <div >
          <h5>{props.voting.location.pick}</h5>
        </div>
        
        <br></br>

        <div >
            <h5>{props.voting.map.pick}</h5>
        </div>

      </div>;
      }
      catch(TypeError){
        return <div>

        <div>
          <h5>0 : 0</h5>
        </div>

        <br></br>

        <div>
            <h5>{props.voting.location.pick ? props.voting.location.pick : ""}</h5>
        </div>

        <br></br>

        <div>
            <h5>{props.voting.map.pick ? props.voting.map.pick : ""}</h5>
        </div>

      </div>;
      }
    }
    else if (props.status === "CHECK_IN") {
      return <h5>Akceptowanie nowego meczu</h5>;
    }
    else if (props.status === "VOTING") {
      return <h5>Pickowanie mapy</h5>;
    }
    else if (props.status === "CAPTAIN_PICK") {
      return <h5>Pickowanie drużyny</h5>;
    }
    else if (props.status === "CONFIGURING") {
      return  <h5>Konfigurowanie serwera</h5>;
    }
    else if (props.status === "CANCELED") {
      return  <h5>Anulowane</h5>;
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
        return <Row>
          <Col xs={2}><img src={players.avatar ? players.avatar : defaultUser} style={{ width: "45px", height: "45px" }}></img></Col>
          <Col xs={4}><a style={{ fontSize: "18px"}}>{players.nickname}</a></Col>
          <Col xs={2}><img src={imgURL[players.game_skill_level]} style={{ width: "30px", height: "30px" }}></img></Col>
          <Col xs={1}><a href={"https://www.faceit.com/pl/players/" + players.nickname}><img src={faceitProfile} style={{ width: "20px", height: "20px" }}></img></a></Col>
          <Col xs={3}><a style={{ fontSize: "18px"}}>{this.getEloPlayer(players.nickname)}</a></Col>
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
        return <Row>
          <Col xs={3}><a style={{ fontSize: "18px"}}>{this.getEloPlayer(players.nickname)}</a></Col>
          <Col xs={1}><a href={"https://www.faceit.com/pl/players/" + players.nickname}><img src={faceitProfile} style={{ width: "20px", height: "20px" }}></img></a></Col>
          <Col xs={2}><img src={imgURL[players.game_skill_level]} style={{ width: "30px", height: "30px" }}></img></Col>
          <Col xs={4}><a style={{ fontSize: "18px"}}>{players.nickname}</a></Col>
          <Col xs={2}><img src={players.avatar ? players.avatar : defaultUser} style={{ width: "45px", height: "45px" }}></img></Col>
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
        <h1>{props.teams.faction1.name}</h1>
        <div>
          {this.rosterTeamA(props)}
        </div>
      </div>
    }
    else {
      return <div>
        <h1>{props.teams.faction1.name}</h1>

        <div>
            {this.getEloTeamA(props)}
        </div>
        
        <div style={{marginTop: 10}}>
          {this.rosterTeamA(props)}
        </div>
      </div>
    }
    
  }

  teamB = (props) => {
    if (props.status === "CHECK_IN"){
      return 
    }
    else if(props.status === "CAPTAIN_PICK"){
      return <div>
      <h1>{props.teams.faction2.name}</h1>
      <div>
        {this.rosterTeamB(props)}
      </div>
    </div>
    }
    else {
      return <div>
        <h1>{props.teams.faction2.name}</h1>

        <div>
          {this.getEloTeamB(props)}
        </div>
        
        <div style={{marginTop: 10}}>
          {this.rosterTeamB(props)}
        </div>
      </div>
    }
  }






  render() {

    const { isLoaded, matches } = this.state;

    if (!isLoaded) {
      return <div><ClipLoader color="#00BFFF" size={100} /></div>;
    } 

    else {
      return (

        <div style={{marginTop: 200}}>

          {matches.length == 0 && <h3 style={{marginTop: -200}}>Aktualnie brak meczów</h3>}
          <ul>
            {matches.map(matches =>
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
                                    {this.teamA(matches)}
                                    </Col>



                                    <Col xs={2} >
                                        <Button variant="dark" href={matches.faceit_url.replace('{lang}', 'pl')}>Room Faceit</Button>
                                        <br></br>
                                        <div style={{marginTop: 50}}>
                                          <div >
                                            {this.matchInfo(matches)}
                                          </div>
                                        </div>
                                    </Col>

                                    
                                    <Col>
                                    {this.teamB(matches)}
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
            )}
          </ul>
        </div>
      )
    }
  }
}