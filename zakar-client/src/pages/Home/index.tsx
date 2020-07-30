import React, { ReactElement, useEffect, useState } from 'react';
import Search from 'components/Search';
import './Home.css';
import BibleBooks from 'components/BibleBooks';
import { useHistory } from 'react-router-dom';

const Home = (props: any): ReactElement => {
  const [shouldRenderBooks, setShouldRenderBooks] = useState(false);
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
      <button onClick={() => setShouldRenderBooks(true)}>Browse Bible Books</button>
      {shouldRenderBooks && <BibleBooks />}
    </div>
  );
};

export default Home;
