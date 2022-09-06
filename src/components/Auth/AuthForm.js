import { useState, useRef } from "react";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  // triggered on form submission
  const submitHandler = (event) => {
    event.preventDefault();

    // collect the current email and password ref values
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = emailInputRef.current.value;

    // validate login credentials

    /**
     * LOGIN MODE
     *
     * CREATE USER MODE
     * Using the fetch method sends a POST request to the firebase api with key,
     * passing it a JSON object in the required format, including the entered email & password.
     * returnSecureToken key must always be true (refer to firebase docs).
     * the headers ensure the REST API knows it's JSON data being passed.
     */
    if (isLogin) {
    } else {
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBV0lUxTg1UPsrG9vJ6iC9ic0lQbGT_R1k",
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => {
        if (res.ok) {
          // handle response
        } else {
          return res.json().then((data) => { // collect and convert the received data, log it.
            console.log(data);
          });
        }
      });
    }
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
          <button>{isLogin ? "Login" : "Create Account"}</button>
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
