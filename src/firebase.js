// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./App.css";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY.toString(),
  authDomain: "frc-pit-scouting-app.firebaseapp.com",
  projectId: "frc-pit-scouting-app",
  storageBucket: "frc-pit-scouting-app.appspot.com",
  messagingSenderId: "734064374661",
  appId: "1:734064374661:web:5e7b6ca2744a6945be4aec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;