import React, { ReactElement } from 'react';
import Search from 'components/Search';
import './Home.css';

const Home = (): ReactElement => {
  return (
    <div className='HomeContainer'>
      <h1>Find your verse.</h1>
      <Search />
    </div>
  );
};

export default Home;
