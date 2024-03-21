import React, { useState } from "react";
import "./App.css";
import { db } from "./firebase";
import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore";

function TeamsTable({ teamsData, eventKey, currTeamNum, currTeamScoutedUpdater }) {
  //const [teamsData, setTeamsData] = useState(teamsData);

  async function onEditHelper(otherTeamNum) {
    const teamsRef = collection(db, eventKey + "-" + currTeamNum);
    const snap = await getDocs(teamsRef);

    snap.forEach((doc) => {
        if (doc.data().team_number == otherTeamNum) {
            console.log(doc.data());
            return doc.data();
        }
    });

    return [];
  }

  function onEditData(teamName, teamNum) {
    window.scrollTo(0, 0);

    onEditHelper(teamNum).then(
        function(value) { 
            console.log(teamNum);
            currTeamScoutedUpdater({"name":teamName,"num":teamNum,"data":value}); 
        },
        function(error) { alert("An unexpected error occurred; please try again") }
    );
  }

  return (
    <>
      <table border="1">
        <thead>
          <tr>
            <td>Team Name</td>
            <td>Team #</td>
            <td>Scouted?</td>
            <td>Edit Info</td>
          </tr>
        </thead>
        <tbody>
          {teamsData.map(function (team) {
            return (
              <tr key={team.team_number}>
                <td>{team.team_name}</td>
                <td>{team.team_number}</td>
                <td>{team.completed}</td>
                <td><button onClick={() => onEditData(team.team_name, 
                    team.team_number)}>Edit</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default TeamsTable;
