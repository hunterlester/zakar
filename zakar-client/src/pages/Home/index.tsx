import React, { ReactElement, useEffect, useContext } from 'react';
import Search from 'components/Search';
import './Home.css';
import { useHistory } from 'react-router-dom';
import { StateContext } from 'StateProvider';

const Home = (): ReactElement => {
  const { verseIDArray: verses } = useContext(StateContext);
  const history = useHistory();

  useEffect(() => {
    if (verses && verses.length) {
      history.replace('/learning-board');
    }
    window.scrollTo(0, 0);
  }, [verses]);

  return (
    <div className="HomeContainer">
      <img src="/android-chrome-192x192.png" alt="zayin hebrew character" title="zayin" />
      <p className="beta">
        <a href="/terms#beta"> Beta version</a>
      </p>
      <h1>Find a verse to start memorizing.</h1>
      <Search />
    </div>
  );
};

export default Home;
