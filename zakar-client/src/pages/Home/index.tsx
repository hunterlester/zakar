import React, { ReactElement, useEffect } from 'react';
import Search from 'components/Search';
import './Home.css';
import { useHistory } from 'react-router-dom';
import { ESV_COPYRIGHT } from 'utils/const';

const Home = (): ReactElement => {
  const history = useHistory();

  useEffect(() => {
    const verses = localStorage.getItem('verseID');
    if (!!verses) {
      history.replace('/learning-board');
    }
  });

  return (
    <div className="HomeContainer">
      <h1>Find your verse.</h1>
      <Search />
      <div className="VerseCopyright">{ESV_COPYRIGHT}</div>
    </div>
  );
};

export default Home;
