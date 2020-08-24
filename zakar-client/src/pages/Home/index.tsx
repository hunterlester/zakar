import React, { ReactElement, useEffect } from 'react';
import Search from 'components/Search';
import './Home.css';
import { useHistory } from 'react-router-dom';

const Home = (): ReactElement => {
  const history = useHistory();

  useEffect(() => {
    const verses = JSON.parse(`${localStorage.getItem('verseIDArray')}`);
    if (verses && verses.length) {
      history.replace('/learning-board');
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="HomeContainer">
      <h1>Find your verse.</h1>
      <Search />
    </div>
  );
};

export default Home;
