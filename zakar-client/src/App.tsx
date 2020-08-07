import React, { ReactElement } from 'react';
import './App.css';
import Home from 'pages/Home';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LearningBoard from 'pages/LearningBoard';

function App(): ReactElement {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/learning-board">
            <LearningBoard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
