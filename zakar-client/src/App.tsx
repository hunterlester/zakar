import React, { ReactElement } from 'react';
import './App.css';
import Home from 'pages/Home';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LearningBoard from 'pages/LearningBoard';
import About from 'pages/About';
import { ESV_COPYRIGHT } from 'utils/const';
import Login from 'pages/Login';

function App(): ReactElement {
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
            <Route path="/login">
              <Login />
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
            <div className="ButtonContainer">
              <Link to="/login">
                <button className="NavButton">Login</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
