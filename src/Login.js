import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [showPass, setShowPass] = useState('password');

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setErrorMessage(errorMessage);
      });
  };

  const showPassClicked = () => {
    (showPass === "password") ? setShowPass("text") : setShowPass("password");
  }

  return (
    <>
      <main>
        <section>
          <div className="centered-container">
          <div className="centered-container"><h1> 🤖 FRC Pit Scouting App - Login </h1></div>

            <form>
              <div className="centered-container">
                <label htmlFor="email-address">Email address: </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="centered-container">
                <label htmlFor="password">Password: </label>
                <input
                  id="password"
                  name="password"
                  type={showPass}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="centered-container mod">
                <label htmlFor="showPass">Show Password: </label>
                <input name="showPass" type="checkbox" onClick={showPassClicked} />
              </div>

              <div className="centered-container morespace">
                <button onClick={onLogin}> Login </button>
              </div>
            </form>

            <div className="centered-container">{errorMessage && ( <p className="error"> {errorMessage} </p> )}</div>
            <div className="centered-container"><p className="text-sm text-white text-center">
            No account yet? <NavLink to="/signup">Sign up</NavLink>
            </p></div>
          </div>
        </section>
      </main>
      
    </>
  );
};

export default Login;
