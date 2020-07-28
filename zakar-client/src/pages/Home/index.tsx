import React, { ReactElement } from 'react';
import Search from 'components/Search';
import './Home.css';
import BibleBooks from 'components/BibleBooks';

const Home = (props: any): ReactElement => {
  console.log(props.location);
  return (
    <div className="HomeContainer">
      <h1>Find your verse.</h1>
      <Search />
      <BibleBooks />
    </div>
  );
};

export default Home;
