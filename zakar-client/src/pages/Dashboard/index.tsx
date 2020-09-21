import React, { ReactElement, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { StateContext } from 'StateProvider';
import { getCookie } from 'utils/helpers';
import './Dashboard.css';

const Dashboard = (): ReactElement => {
  const { completedVerses, fetchCompletedVerses } = useContext(StateContext);
  const history = useHistory();
  useEffect(() => {
    const isLoggedIn = getCookie('bearer');
    if (!isLoggedIn) {
      history.push('/');
    }
    window.scrollTo(0, 0);

    if (!completedVerses.length) {
      fetchCompletedVerses();
    }
  }, []);

  return (
    <div className="DashboardContainer">
      <h3>Memorized verses:</h3>
      {completedVerses.map((verse, i) => (
        <div key={`verse-${i}`} dangerouslySetInnerHTML={{ __html: verse }} />
      ))}
    </div>
  );
};

export default Dashboard;
