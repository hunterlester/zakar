import React, { ReactElement } from 'react';
import './App.css';
import Home from 'pages/Home';
import Verse from 'pages/Verse';
import BookChapters from 'pages/BookChapters';
import Verses from 'pages/Verses';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LearningBoard from 'pages/LearningBoard';

function App(): ReactElement {
  return (
    <Router>
      <div className="App">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>

        <Switch>
          <Route exact path="/">
            <Home />
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
          <Route path="/learning-board">
            <LearningBoard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
