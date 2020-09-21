import React, { ReactElement, useEffect, useState } from 'react';
import './App.css';
import Home from 'pages/Home';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LearningBoard from 'pages/LearningBoard';
import About from 'pages/About';
import { ESV_COPYRIGHT } from 'utils/const';
import { getCookie } from 'utils/helpers';
import LoginCTA from 'components/LoginCTA';
import { StateProvider } from 'StateProvider';
import Dashboard from 'pages/Dashboard';

function App(): ReactElement {
  const [loginStatus, setLoginStatus] = useState(false);
  useEffect(() => {
    const loginStatus = getCookie('bearer');
    setLoginStatus(!!loginStatus);
  });
  return (
    <Router>
      <StateProvider>
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
              <Route path="/login-cta">
                <LoginCTA />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
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
              {loginStatus && (
                <div className="ButtonContainer">
                  <Link to="/dashboard">
                    <button className="NavButton">Dashboard</button>
                  </Link>
                </div>
              )}
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
      </StateProvider>
    </Router>
  );
}

export default App;
