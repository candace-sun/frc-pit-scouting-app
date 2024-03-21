import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import TeamsScreen from "./TeamsScreen";
import "./App.css";

const Home = () => {
  const navigate = useNavigate();
  const [teamsData, setTeamsData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [teamsLoaded, setTeamsLoaded] = useState("");
  const [currTeamNum, setCurrTeamNum] = useState("");
  const [eventKey, setEventKey] = useState("");
  const [teamSelected, setTeamSelected] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
        navigate("/login");
        //("user is logged out");
      }
    });
  }, []); // runs only on first render

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
        //console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  async function writeHelper(eventKey, teamNumber, otherTeamNumber, dbData) {
    const docRef = await setDoc(doc(db, eventKey + "-" + teamNumber, otherTeamNumber), dbData);
  }

  async function eventSubmitHelper(eventKey, teamNumber) {
    const teamsRef = collection(db, eventKey + "-" + teamNumber);

    const snap = await getDocs(teamsRef);
    if (snap.empty) {
      // no docs in collection: 
      // first get list of teams from api call
      $.ajax({
        url: `https://www.thebluealliance.com/api/v3/event/${eventKey}/teams`,
        headers: {
          "X-TBA-Auth-Key": process.env.REACT_APP_TBA_KEY.toString(),
        },
        method: "GET",
        dataType: "json",

        // upon successful get request, write new collection data to db
        success: function (data) {
          let teamPresent = false;

          // first check whether the provided team number is valid (in the event)
          data.forEach((team) => {
            if ((team.team_number).toString() == teamNumber) {
                teamPresent = true;
            }
          });

          if (!teamPresent) {
            setErrorMessage(
                "Your team number is not in this event; please try again"
            );
            setTeamsLoaded("");
            return;
          }

          let dbData = { 
            "team_name": "", "scout_name":"","intake":"", "drive_train":"", "climb":"", 
            "autonomous":"","speaker":"","amp":"", "trap":"","driving_skill":"",
            "weight":"","cycle_time":"","other":"", "completed":"No", "team_number":''
          };

          let dataToDisplay = [];

          // for each team, write its data as a document to db
          data.forEach((team) => {
            dbData["team_name"] = team.nickname;
            dbData["team_number"] = (team.team_number).toString();

            // write dbData to Firestore
            writeHelper(eventKey, teamNumber, dbData["team_number"], dbData).then(
                function(value) {  }, 
                function(error) { 
                    console.log(error);
                    setErrorMessage(
                        "An error occurred with your request; please try again"
                    );
                    setTeamsLoaded("");
                    // this could cause problems if a collection gets only half written; might want to do
                    // a len check later
                    return; 
                 },
            );

            // add team to display data
            dataToDisplay.push({
                "team_name": team.nickname, "team_number": team.team_number, "completed": "No"
            });
          });
          // update teamsTable with the data to display
          setTeamsData(dataToDisplay);
          setErrorMessage("");
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
          setErrorMessage(
            "An error occurred with your request; please try again"
          );
          setTeamsLoaded("");
          return;
        },
      });
    } 
    
    // if the collection for the given event and team already exists, read it
    else {
        let dataToDisplay = [];

        snap.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            dataToDisplay.push({
                "team_name": doc.data().team_name, 
                "team_number": (doc.data().team_number), "completed": doc.data().completed
            });

        });
        // update teamsTable with the data to display
        //console.log(dataToDisplay);
        setTeamsData(dataToDisplay);
    }

    return "complete";
  }

  function handleEventSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    let eventKey = formJson.year + formJson.eventCode.toLowerCase();
    setTeamSelected("");

    eventSubmitHelper(eventKey, formJson.myTeam).then(
      function (value) {
        if (value != undefined) {
            setTeamsLoaded("True");
            setEventKey(eventKey);
            setCurrTeamNum(formJson.myTeam);
            setErrorMessage("");
        }
      },
      function (error) {
        setErrorMessage(
          "An error occurred with your request; please try again"
        );
        setTeamsLoaded("");
      }
    );
  }

  return (
    <>
      <div id="header-container">
        <h1>🤖 FRC Pit Scouting App</h1>
        <button onClick={handleLogout} id="logout"> Logout </button>
      </div>
      <div id="home-grid">

        <form method="get" onSubmit={handleEventSubmit} id="search-container">
            <label htmlFor="year">Year: </label>
            <input type="text" id="year" defaultValue="2024" name="year" size="4" />

            <label htmlFor="eventCode">Event Code: </label>
            <input type="text" id="eventCode" defaultValue="VAFAL" name="eventCode" size="5" />

            <label htmlFor="myTeam">My team's number: </label>
            <input type="text" id="myTeam" defaultValue="612" name="myTeam" size="4" />

            <input type="submit" />
        </form>

        {teamsLoaded && <TeamsScreen teamsData={teamsData} eventKey={eventKey} 
            currTeamNum={currTeamNum} teamsDataUpdater={setTeamsData}
            teamSelected={teamSelected} teamSelectedUpdater={setTeamSelected}/>}
    </div>

    {errorMessage && <p className="error"> {errorMessage} </p>}

    <div className="footer-container">
        <p>Powered by <a 
            href="https://www.thebluealliance.com/">The Blue Alliance</a>, built with <a 
            href="https://firebase.google.com/">Firebase</a> & <a
            href="https://react.dev/">React</a></p>
    </div>
    </>
  );
};

export default Home;
