import React, { ReactElement } from 'react';
import './LoginCTA.css';
import { useHistory } from 'react-router-dom';

const LoginCTA = (): ReactElement => {
  const history = useHistory();

  return (
    <div className="LoginCTAContainer">
      <p>Please login to unlock all features.</p>
      <div className="CTAButtons">
        <a href="/login">
          <img src="/btn_google_signin_dark_pressed_web@2x.png" alt="Sign in with Google" />
        </a>
        <button
          onClick={() => {
            history.push('/');
          }}
          className="CTAButton"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginCTA;
