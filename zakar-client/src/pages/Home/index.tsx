import React, { ReactElement, useEffect } from 'react';
import Search from 'components/Search';
import './Home.css';
import { useHistory } from 'react-router-dom';

const Home = (props: any): ReactElement => {
  const history = useHistory();

  useEffect(() => {
    const verses = JSON.parse(`${localStorage.getItem('verses')}`);
    if (!!verses) {
      history.replace('/learning-board');
    }
  });

  return (
    <div className="HomeContainer">
      <h1>Find your verse.</h1>
      <Search />
    </div>
  );
};

export default Home;
