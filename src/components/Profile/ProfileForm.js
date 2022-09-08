import { useRef, useContext } from "react";

import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const newPasswordInputRef = useRef(); // bound to the password input below

  const authCtx = useContext(AuthContext); // allows usage of auth context in this component

  // handles collecting the password input on form submit
  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    // password validation

    /**
     * sends a POST request to the firebase password reset url with api key.
     * passing the required JSON data in the body of the request.
     * password is received from the form and token is received from the auth context provider
     */

     fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBZhsabDexE9BhcJbGxnZ4DiRlrCN9xe24', {
        method: 'POST',
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        // assumption: Always succeeds!
  
    });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
