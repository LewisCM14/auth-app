import React, { useState, useEffect, useCallback } from "react";

// instantiates the logout timer
let logoutTimer;

/**
 * context handler for the authentication state,
 * stores the token and logged in state plus login/logout functions
 */
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculatedRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime(); // collect current time stamp in ms
    const adjExpirationTime = new Date(expirationTime).getTime();  // finds the value of the expiration time

    const remainingDuration = adjExpirationTime - currentTime;  // calculate time left

    return remainingDuration;
};

/**
 * collects the token & expiration time from local storage, passed in loginHandler
 * uses these to calculate the remaining time the token is valid for.
 * returning a valid token if expiration time threshold isn't breeched
 */
const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');

    const remainingTime = calculatedRemainingTime(storedExpirationDate)

    if (remainingTime <= 60000) {  // token expiration threshold reached
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime,
    }
};

/**
 * context provider for authentication state,
 * manages the token state, using it to determine user state and handle login/logout functionality
 */
export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;  // instantiates the token variable
  if (tokenData) {
    initialToken = tokenData.token // if stored, collects the token key from the result of retrieveStoredToken
  }
  
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token; // if 'token' holds a string value user must be logged in

  const logoutHandler = useCallback(() => {  // clears token, alerting the client that the user is no longer authorized
    setToken(null);
    localStorage.removeItem('token'); // remove the token key from local storage
    localStorage.removeItem('expirationTime'); // remove the expirationTime key from local storage

    // resets any existing timer
    if (logoutTimer) {
        clearTimeout(logoutTimer)
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token); // store the auth token in the browser
    localStorage.setItem('expirationTime', expirationTime);  // stores the expiration time passed

    const remainingTime = calculatedRemainingTime(expirationTime);  // use the helper function to calculate time left
    
    logoutTimer = setTimeout(logoutHandler, remainingTime);  // stores the time remaining in a variable
  };

  useEffect(() => {
    if (tokenData) {
        console.log(tokenData.duration);
        logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
