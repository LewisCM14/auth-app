import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const history = useHistory(); // collect the history object
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext); // allow use of the auth-context provider in this component

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  /**
   * Using the fetch method sends a POST request to the relevant firebase api with key,
   * passing it a JSON object in the required format, including the entered email & password.
   * returnSecureToken key must always be true (refer to firebase docs).
   * the headers ensure the REST API knows it's JSON data being passed.
   */
  const submitHandler = (event) => {
    event.preventDefault();

    // collect the current email and password ref values
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = emailInputRef.current.value;

    // validate login credentials

    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBV0lUxTg1UPsrG9vJ6iC9ic0lQbGT_R1k";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBV0lUxTg1UPsrG9vJ6iC9ic0lQbGT_R1k";
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(true);
        if (res.ok) {
          return res.json();
        } else {
          // collect and convert the received data
          return res.json().then((data) => {
            let errorMessage = "Authentication failed!"; // generic error message
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message; // drill into the specific error message returned
            }
            throw new Error(errorMessage); // forward the error message to the catch block
          });
        }
      })
      .then((data) => {
        // block for successful request
        authCtx.login(data.idToken); // passes the id token from firebase to the login function of the auth-context provider
        history.replace('/');  // use the history object to call the replace method
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending Request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
