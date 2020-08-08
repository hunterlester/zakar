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
import Listening from 'components/Activities/Listening';

const LearningBoard = (): ReactElement => {
  const [activityState, setActivityState] = useState<Activities>(Activities.Builder);
  const history = useHistory();
  const [verseString, setVerse] = useVerse('');

  const activitySwitch = (activityState: Activities) => {
    switch (activityState) {
      case Activities.Builder:
        return <Builder verseString={verseString} setVerse={setVerse} />;
      case Activities.DoodlePad:
        return <DoodlePad verseString={verseString} />;
      case Activities.Recite:
        return <Recite verseString={verseString} />;
      case Activities.FocusedScroll:
        return <FocusedScroll />;
      case Activities.Typing:
        return <Typing verseString={verseString} />;
      case Activities.Listening:
        return <Listening verseString={verseString} />;
      default:
        return;
    }
  };

  useEffect(() => {
    const verses = localStorage.getItem('verseID');

    if (!verses) {
      history.replace('/');
    }
  }, []);

  console.log('ACTIVITY STATE: ', activityState);

  return (
    <>
      <ActivitiesBar activityState={activityState} setActivityState={setActivityState} />
      <div className="ActivityBlock">{activitySwitch(activityState)}</div>
    </>
  );
};

export default LearningBoard;
