import React, { useState } from "react";

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
 * context provider for authentication state,
 * manages the token state, using it to determine user state and handle login/logout functionality
 */
export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token'); // if stored, collects the token key
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token; // if 'token' holds a string value user must be logged in

  const logoutHandler = () => {  // clears token, alerting the client that the user is no longer authorized
    setToken(null);
    localStorage.removeItem('token'); // remove the token key from local storage
  };

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token); // store the auth token in the browser

    const remainingTime = calculatedRemainingTime(expirationTime);  // use the helper function to calculate time left
    
    setTimeout(logoutHandler, remainingTime);
  };

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
