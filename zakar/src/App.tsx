import React, { ReactElement } from 'react';
import './App.css';
import Home from 'pages/Home';
import Dashboard from 'pages/Dashboard';
import Verse from 'pages/Verse';
import BookChapters from 'pages/BookChapters';
import Verses from 'pages/Verses';
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
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/book/:bookId">
            <BookChapters />
          </Route>
          <Route exact path="/book/:bookId/chapter/:chapterId">
            <Verses />
          </Route>
          <Route exact path="/book/:bookId/chapter/:chapterId/verse/:verseId">
            <Verse />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
