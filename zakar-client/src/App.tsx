import React, { ReactElement, useEffect, useState } from 'react';
import './App.css';
import Home from 'pages/Home';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LearningBoard from 'pages/LearningBoard';
import About from 'pages/About';
import { ESV_COPYRIGHT } from 'utils/const';
import Global from 'pages/Global';
import { getCookie } from 'utils/helpers';
import LoginCTA from 'components/LoginCTA';

function App(): ReactElement {
  const [loginStatus, setLoginStatus] = useState(false);
  useEffect(() => {
    const loginStatus = getCookie('login');
    if (loginStatus === 'true') {
      setLoginStatus(true);
    } else {
      setLoginStatus(false);
    }
  });
  return (
    <Router>
      <div className="App">
        <div className="ContentWrapper">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/learning-board">
              <LearningBoard />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/global">
              <Global />
            </Route>
            <Route path="/login-cta">
              <LoginCTA />
            </Route>
          </Switch>
        </div>
        <div className="Footer">
          <div className="VerseCopyright">{ESV_COPYRIGHT}</div>
          <div className="Nav">
            <div className="ButtonContainer">
              <Link to="/">
                <button className="NavButton">Home</button>
              </Link>
            </div>
            <div className="ButtonContainer">
              <Link to="/about">
                <button className="NavButton">About</button>
              </Link>
            </div>
            {/* <div className="ButtonContainer">
              <Link to="/global">
                <button className="NavButton">Global</button>
              </Link>
                </div> */}
            {loginStatus && (
              <div className="ButtonContainer">
                <a href="/logout">
                  <button className="NavButton">Log Out</button>
                </a>
              </div>
            )}
            {!loginStatus && (
              <div className="ButtonContainer">
                <a href="/login">
                  <button className="NavButton">Login</button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
