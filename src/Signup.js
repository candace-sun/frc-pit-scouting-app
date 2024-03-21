import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [showPass, setShowPass] = useState('password');

  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        navigate("/login");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setErrorMessage(errorMessage);
        // ..
      });
  };

  const showPassClicked = () => {
    (showPass === "password") ? setShowPass("text") : setShowPass("password");
  }

  return (
    <main>
      <section>
          <div className="centered-container">
            <div className="centered-container"><h1> 🤖 FRC Pit Scouting App - Signup </h1></div>
            <form>
              <div className="centered-container">
                <label htmlFor="email-address">Enter your email address: </label>
                <input
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                />
              </div>

              <div className="centered-container">
                <label htmlFor="password">Set a password: </label>
                <input
                  type={showPass}
                  label="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </div>

              <div className="centered-container mod">
                <label htmlFor="showPass">Show Password: </label>
                <input name="showPass" type="checkbox" onClick={showPassClicked} />
              </div>

              <div className="centered-container morespace">
                <button type="submit" onClick={onSubmit}>
                    Sign up
                </button>
              </div>
            </form>

            <div className="centered-container">
                {errorMessage && ( <p className="error"> {errorMessage} </p> )}</div>

            <div className="centered-container"><p>
            Already have an account? <NavLink to="/login">Sign in</NavLink>
            </p></div>
          </div>
      </section>
    </main>
  );
};

export default Signup;
