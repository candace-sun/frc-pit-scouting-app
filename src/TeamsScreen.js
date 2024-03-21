import React, { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import NewScoutInput from "./NewScoutInput";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

function TeamsScreen({ teamsData, eventKey, currTeamNum, teamsDataUpdater, teamSelected,
  teamSelectedUpdater }) {
  const [otherTeam, setOtherTeam] = useState({});
  const [otherData, setOtherData] = useState({});
  const [galleryImgs, setGalleryImgs] = useState([]);

  const storage = getStorage();

  // for real-time updates on whether a team has been scouted or not
  useEffect(() => {
    async function fetchData() {
      const unsub = onSnapshot(collection(db, eventKey + "-" + currTeamNum), (snapshot) => {
        const teams = snapshot.docs.map((document) => {
        return { "team_name": document.data().team_name, 
                  "team_number": (document.data().team_number), "completed": document.data().completed };
        });
      teamsDataUpdater(teams);
    });
    }
    fetchData();
  }, []); 


  async function onEditHelper(otherTeamNum) {
    const teamsRef = collection(db, eventKey + "-" + currTeamNum);
    const snap = await getDocs(teamsRef);

    let baseURL = `images/${eventKey}-${currTeamNum}/${otherTeamNum}/`;
    let storageRef = ref(storage, baseURL);
    const res = await listAll(storageRef);
    let ret = {};
    let imgUrls = [];

    snap.forEach((doc) => {
        if (doc.data().team_number === otherTeamNum) {
            ret = doc.data();
        }
    });
    
    for (const itemRef of res.items) {
      const url = await getDownloadURL(itemRef);
      imgUrls.push(url);
    }

    //console.log("final:",imgUrls);
    setGalleryImgs(imgUrls);

    return ret;
  }

  function onEditData(teamName, teamNum) {
    window.scrollTo(0, 0);

    onEditHelper(teamNum).then(
        function(value) { 
          setOtherTeam({"name":teamName,"num":teamNum});
          setOtherData(value);
          teamSelectedUpdater("true");
        },
        function(error) { 
          console.log(error);
          alert("An unexpected error occurred; please try again");
          setOtherTeam({});
          setOtherData({});
          teamSelectedUpdater("");
         }
    );
  }

  return (
    <>
      {teamSelected && <h2 id="heading">Currently Scouting: {otherTeam.name}</h2>}
      
      <table>
        <thead>
          <tr>
            <td>Team Name</td>
            <td>Team #</td>
            <td>Scouted?</td>
            <td>Update</td>
          </tr>
        </thead>
        <tbody>
          {teamsData.map(function (team) {
            return (
              <tr key={team.team_number}>
                <td>{team.team_name}</td>
                <td>{team.team_number}</td>
                <td style={{ backgroundColor: team.completed === "Yes" ? "#88d69c" : "#ff7f7f" }}>{team.completed}</td>
                <td><button className="edit_button" onClick={() => onEditData(team.team_name, 
                    team.team_number)}>Edit</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      
      {teamSelected && <NewScoutInput 
        myTeamNumber={currTeamNum} eventKey={eventKey} otherName={otherTeam.name}
        otherNum={otherTeam.num} otherData={otherData} 
        teamsData={teamsData} teamsDataUpdater={teamsDataUpdater} 
        galleryImgs={galleryImgs} galleryImgsUpdater={setGalleryImgs}/> }

    </>
  );
}

export default TeamsScreen;
