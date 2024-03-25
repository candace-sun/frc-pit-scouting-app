# FIRST Robotics Competition Pit Scouting Application
Problem: FIRST Robotics teams are incentivized to record data such as the various skills and capabilities of other teams to decide on potential alliances. My sister's team did not have a convenient and centralized system to do so efficiently, relying on paper notes and time-consuming forms that made this process not as helpful as it should be. 

Solution: I built this web application as a means for collecting all of the data needed in one place. It is additionally quite scalable, as it can be used by any team and for any event. 

## Implemented Features
- Utilizes [The Blue Alliance API](https://www.thebluealliance.com/) to retrieve data on teams and events
- User authentication to perform actions in the site
- Users can upload images and write/update text data
- Updates page live upon edits from other users
- Mobile responsive and additionally optimized for phone use

## Preview
![Pit Scouting App Preview](https://github.com/candace-sun/frc-pit-scouting-app/blob/main/pit%20scouting%20app%201.PNG)

## Technologies
* React.js: handles modular components of the application, such as the table of teams, form input, login/signup pages, etc
* Firebase: Firestore Database, Authentication, Web Hosting, Cloud Storage, CLI
* CSS/HTML
