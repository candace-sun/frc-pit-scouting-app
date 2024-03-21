import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

function ScoutInput({ myTeamNumber, otherTeam, eventKey }) {
  const [errorMessage, setErrorMessage] = useState("");

  async function scoutSubmitHelper(formJson) {
    console.log(formJson);
    console.log(typeof myTeamNumber);
    const docRef = await setDoc(doc(db, eventKey + "-" + myTeamNumber, otherTeam.num), formJson); // will overwrite
  }

  function handleScoutSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    let formJson = Object.fromEntries(formData.entries());
    formJson['completed'] = "Yes";
    formJson['team_name'] = otherTeam.name;
    formJson['team_number'] = otherTeam.num;

    /* write to Firestore */
    scoutSubmitHelper(formJson).then(
      function (value) {
        /* code if successful */
        alert("Successfully saved!");
        setErrorMessage("");
      },
      function (error) {
        console.log(error);
        setErrorMessage(
          "An error occurred with your request; please try again"
        );
      }
    );
  }

  return (
    <div id="scoutForm">
      
      <form method="post" onSubmit={handleScoutSubmit}>
        <fieldset>
          <legend>Scout Data for Team {otherTeam.num}:</legend>

          <label htmlFor="scout_name">Your Name: </label>
          <input id="scout_name" type="text" name="scout_name" value={otherTeam.data.scout_name}/>
          <br />

          <label htmlFor="intake">Intake: </label>
          <input id="intake" list="intake_lst" name="intake" value={otherTeam.data.intake}/>
            <datalist id="intake_lst">
              <option value="Under the bumper" />
              <option value="From ground" />
              <option value="Human source" />
            </datalist>
          <br />

          <label htmlFor="drive_train">Drive Train: </label>
          <input id="drive_train" list="drive_train_lst" name="drive_train" 
            value={otherTeam.data.drive_train}/>
            <datalist id="drive_train_lst">
              <option value="Swerve" />
              <option value="Tank" />
              <option value="Mechanum" />
              <option value="West coast" />
            </datalist>
          <br />

          <label htmlFor="climb">Climb: </label>
          <input id="climb" list="climb_lst" name="climb" value={otherTeam.data.climb}/>
            <datalist id="climb_lst">
              <option value="Very good" />
              <option value="Decent" />
              <option value="Mid" />
              <option value="Bad" />
              <option value="Non-existent" />
            </datalist>
          <br />

          <label htmlFor="autonomous">Autonomous: </label>
          <input id="autonomous" list="autonomous_lst" name="autonomous" value={otherTeam.data.autonomous}/>
            <datalist id="autonomous_lst">
              <option value="Very good" />
              <option value="Decent" />
              <option value="Mid" />
              <option value="Bad" />
              <option value="Non-existent" />
            </datalist>
          <br />

          <label htmlFor="speaker">Speaker: </label>
          <input id="speaker" list="speaker_lst" name="speaker" value={otherTeam.data.speaker}/>
            <datalist id="speaker_lst">
              <option value="Preferred" />
              <option value="Can do both" />
              <option value="Nope" />
            </datalist>
          <br />

          <label htmlFor="amp">Amp: </label>
          <input id="amp" list="amp_lst" name="amp" value={otherTeam.data.amp}/>
            <datalist id="amp_lst">
              <option value="Preferred" />
              <option value="Can do both" />
              <option value="Nope" />
            </datalist>
          <br />

          <label htmlFor="trap">Trap: </label>
          <input id="trap" list="trap_lst" name="trap" value={otherTeam.data.trap}/>
            <datalist id="trap_lst">
              <option value="Very good" />
              <option value="Decent" />
              <option value="Mid" />
              <option value="Bad" />
              <option value="Non-existent" />
            </datalist>
          <br />

          <label htmlFor="driving_skill">Driving Skill: </label>
          <input
            id="driving_skill"
            list="driving_skill_lst"
            name="driving_skill"
            value={otherTeam.data.driving_skill} />
            <datalist id="driving_skill_lst">
              <option value="Very good" />
              <option value="Decent" />
              <option value="Mid" />
              <option value="Bad" />
              <option value="Non-existent" />
            </datalist>
          <br />

          <label htmlFor="weight">Weight (lbs): </label>
          <input id="weight" type="number" name="weight" value={otherTeam.data.weight}/>
          <br />

          <label htmlFor="cycle_time">Cycle Time (sec): </label>
          <input id="cycle_time" type="number" name="cycle_time" value={otherTeam.data.cycle_time}/>
          <br />

          <label htmlFor="other">Other: </label>
          <br />
          <textarea name="other" rows="3" cols="50" value={otherTeam.data.other}></textarea>
          <br />

          <input type="submit" value="Save" /> <input type="reset" value="Clear" />
        </fieldset>
      </form>

      {errorMessage && <p className="error"> {errorMessage} </p>}
    </div>
  );
}

export default ScoutInput;
