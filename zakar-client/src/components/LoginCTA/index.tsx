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
                <button className="CTAButton">Login</button>
              </a>
              <button onClick={() => {
                history.push("/");
              }} className="CTAButton">Close</button>
            </div>
        </div>
    );
};

export default LoginCTA;