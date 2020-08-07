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
import useVerse from 'hooks/useVerse';

const LearningBoard = (): ReactElement => {
  const [activityState, setActivityState] = useState<Activities>(Activities.Builder);
  const history = useHistory();
  const [verseArray, setVerseArray] = useVerse([]);

  const activitySwitch = (activityState: Activities) => {
    switch (activityState) {
      case Activities.Builder:
        return <Builder verses={verseArray} setVerseArray={setVerseArray} />;
      case Activities.DoodlePad:
        return <DoodlePad verses={verseArray} />;
      case Activities.Recite:
        return <Recite verses={verseArray} />;
      case Activities.FocusedScroll:
        return <FocusedScroll verses={verseArray} />;
      case Activities.Typing:
        return <Typing verses={verseArray} />;
      default:
        return;
    }
  };

  useEffect(() => {
    const verses = JSON.parse(`${localStorage.getItem('versesID')}`);

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
