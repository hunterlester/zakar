import React, { ReactElement } from 'react';
import './App.css';
import Home from 'pages/Home';
import Dashboard from 'pages/Dashboard';
import Verse from 'pages/Verse';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function App(): ReactElement {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/verse">Verse</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/verse">
            <Verse />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
