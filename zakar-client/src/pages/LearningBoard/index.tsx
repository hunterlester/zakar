import React, { ReactElement, useState, useEffect } from 'react';
import { Activities } from 'utils/const';
import { useHistory } from 'react-router-dom';
import ActivitiesBar from 'components/ActivitiesBar';
import './LearningBoard.css';
import DoodlePad from 'components/Activities/DoodlePad';
import Recite from 'components/Activities/Recite';
import FocusedScroll from 'components/Activities/FocusedScroll';
import Typing from 'components/Activities/Typing';
import Builder from 'components/Activities/Builder';

const LearningBoard = (): ReactElement => {
  const [activityState, setActivityState] = useState<Activities>(Activities.Builder);
  const history = useHistory();

  const activitySwitch = (activityState: Activities) => {
    switch (activityState) {
      case Activities.Builder:
        return <Builder />;
      case Activities.DoodlePad:
        return <DoodlePad />;
      case Activities.Recite:
        return <Recite />;
      case Activities.FocusedScroll:
        return <FocusedScroll />;
      case Activities.Typing:
        return <Typing />;
      default:
        return;
    }
  };

  useEffect(() => {
    const verses = JSON.parse(`${localStorage.getItem('verses')}`);

    if (!verses) {
      history.replace('/');
    }
  }, []);

  console.log('ACTIVITY STATE: ', activityState);

  return (
    <>
      <ActivitiesBar setActivityState={setActivityState} />
      <div className="ActivityBlock">{activitySwitch(activityState)}</div>
    </>
  );
};

export default LearningBoard;
