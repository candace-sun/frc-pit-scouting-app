import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./App.css";
import { collection, addDoc, setDoc, doc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";

function NewScoutInput({ myTeamNumber, eventKey, otherName, otherNum, otherData,
    teamsData, teamsDataUpdater, galleryImgs, galleryImgsUpdater }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const storage = getStorage();

  useEffect(() => {
  }, [galleryImgs]);
 
  async function imgHandler() {
    let imgUrls = galleryImgs;
    let baseURL = `images/${eventKey}-${myTeamNumber}/${otherNum}/`;

    for (let file of selectedImages) {
        let filename = file.name;
        const storageRef = ref(storage, baseURL + filename);

        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        imgUrls.push(url);
    };

    galleryImgsUpdater(imgUrls);
    setSelectedImages([]);
  }

  async function scoutSubmitHelper(formJson) {
    const docRef = await setDoc(doc(db, eventKey + "-" + myTeamNumber, otherNum.toString()), formJson); // will overwrite
  }

  function handleScoutSubmit(e) {
    e.preventDefault();
    setErrorMessage("Loading...");
    const form = e.target;
    const formData = new FormData(form);
    let formJson = Object.fromEntries(formData.entries());
    let completed = false;

    // if the form is empty, set completed as No
    for (const property in formJson) {
        if (formJson[property] != "" && (property != "team_name" && (
            property != "team_number" && (property != "completed" && property != "imgs")))) {
            completed = true;
        }
    }
    
    formJson['completed'] = "No";
    formJson['team_name'] = otherName;
    formJson['team_number'] = otherNum;
    delete formJson.imgs;
    imgHandler(); // handle image uploads separately in Firebase Cloud Storage

    if (completed || galleryImgs.length > 0) {
        console.log("completed bruh");
        formJson['completed'] = "Yes";
    }

    /* write to Firestore */
    scoutSubmitHelper(formJson).then(
      function (value) {
        /* code if successful */
        alert("Successfully saved!");
        let temp = teamsData;

        for (let team of temp) {
            if (team.team_number == otherNum) {
                team.completed = formJson['completed']; // update completed on teams table
                
                teamsDataUpdater(temp);
            }
        }
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
          <legend>Scout Data for Team {otherNum}:</legend>

          <label htmlFor="scout_name">Scout Name: </label>
          <input id="scout_name" type="text" name="scout_name" defaultValue={otherData.scout_name}
          key={otherNum +"_scout_name"}/>
          <br />

          <label htmlFor="intake">Intake: </label>
          <input id="intake" list="intake_lst" name="intake" defaultValue={otherData.intake}
          key={otherNum +"_intake"}/>
            <datalist id="intake_lst">
              <option value="Under the bumper" />
              <option value="From ground" />
              <option value="Human source" />
            </datalist>
          <br />

          <label htmlFor="drive_train">Drive Train: </label>
          <input id="drive_train" list="drive_train_lst" name="drive_train" 
            defaultValue={otherData.drive_train} key={otherNum +"_drive_train"}/>
            <datalist id="drive_train_lst">
              <option value="Swerve" />
              <option value="Tank" />
              <option value="Mechanum" />
              <option value="West coast" />
            </datalist>
          <br />

          <label htmlFor="climb">Climb: </label>
          <input id="climb" list="climb_lst" name="climb" defaultValue={otherData.climb} 
          key={otherNum +"_climb"}/>
            <datalist id="climb_lst">
              <option value="Very good" />
              <option value="Decent" />
              <option value="Mid" />
              <option value="Bad" />
              <option value="Non-existent" />
            </datalist>
          <br />

          <label htmlFor="autonomous">Autonomous: </label>
          <input id="autonomous" list="autonomous_lst" name="autonomous" defaultValue={otherData.autonomous} 
          key={otherNum +"_autonomous"}/>
            <datalist id="autonomous_lst">
              <option value="Very good" />
              <option value="Decent" />
              <option value="Mid" />
              <option value="Bad" />
              <option value="Non-existent" />
            </datalist>
          <br />

          <label htmlFor="speaker">Speaker: </label>
          <input id="speaker" list="speaker_lst" name="speaker" defaultValue={otherData.speaker} 
          key={otherNum +"_speaker"}/>
            <datalist id="speaker_lst">
              <option value="Preferred" />
              <option value="Can do both" />
              <option value="Nope" />
            </datalist>
          <br />

          <label htmlFor="amp">Amp: </label>
          <input id="amp" list="amp_lst" name="amp" defaultValue={otherData.amp} 
          key={otherNum +"_amp"}/>
            <datalist id="amp_lst">
              <option value="Preferred" />
              <option value="Can do both" />
              <option value="Nope" />
            </datalist>
          <br />

          <label htmlFor="trap">Trap: </label>
          <input id="trap" list="trap_lst" name="trap" defaultValue={otherData.trap} 
          key={otherNum +"_trap"}/>
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
            defaultValue={otherData.driving_skill} key={otherNum +"_driving_skill"} />
            <datalist id="driving_skill_lst">
              <option value="Very good" />
              <option value="Decent" />
              <option value="Mid" />
              <option value="Bad" />
              <option value="Non-existent" />
            </datalist>
          <br />

          <label htmlFor="weight">Weight (lbs): </label>
          <input id="weight" type="number" name="weight" defaultValue={otherData.weight} 
          key={otherNum +"_weight"}/>
          <br />

          <label htmlFor="cycle_time">Cycle Time (sec): </label>
          <input id="cycle_time" type="number" name="cycle_time" defaultValue={otherData.cycle_time} 
          key={otherNum +"_cycle_time"}/>
          <br />

          <label htmlFor="other">Other: </label>
          <br />
          <textarea name="other" rows="2" cols="25" defaultValue={otherData.other} 
          key={otherNum +"_other"}></textarea>
          <br />

          <label htmlFor="imgs">Upload images: </label>
          <input type="file" name="imgs" multiple 
          onChange={(event) => {
            setSelectedImages(event.target.files);
          }}/>
          <br/>


          <input type="submit" value="Save" /> <input type="reset" value="Reset" />
        </fieldset>
      </form>

      {errorMessage && <p className="error"> {errorMessage} </p>}

      <div>
        {(galleryImgs.length > 0) && 
            <>
            <h3>Image Gallery</h3>
            <div className="gallery">
                {galleryImgs.map(function (imgUrl, index) {
                    return (
                        <a href={imgUrl} target="_blank">
                        <img src={imgUrl} key={index} alt="gallery image"/>
                        </a>
                    );
                })}
            </div>
            </>
        }
      </div>
    </div>
  );
}

export default NewScoutInput;
