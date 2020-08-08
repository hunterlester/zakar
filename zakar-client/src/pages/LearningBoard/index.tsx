import React, { ReactElement, useState, useEffect } from 'react';
import { Activities } from 'utils/const';
import { useHistory } from 'react-router-dom';
import ActivitiesBar from 'components/ActivitiesBar';
import './LearningBoard.css';
import Doodle from 'components/Activities/Doodle';
import Recite from 'components/Activities/Recite';
import Read from 'components/Activities/Read';
import Type from 'components/Activities/Type';
import Build from 'components/Activities/Build';
import useVerse from 'hooks/useVerse';
import Listen from 'components/Activities/Listen';

const LearningBoard = (): ReactElement => {
  const [activityState, setActivityState] = useState<Activities>(Activities.Build);
  const history = useHistory();
  const [verseString, setVerse] = useVerse('');

  const activitySwitch = (activityState: Activities) => {
    switch (activityState) {
      case Activities.Build:
        return <Build verseString={verseString} setVerse={setVerse} />;
      case Activities.Doodle:
        return <Doodle verseString={verseString} />;
      case Activities.Recite:
        return <Recite verseString={verseString} />;
      case Activities.Read:
        return <Read />;
      case Activities.Type:
        return <Type verseString={verseString} />;
      case Activities.Listen:
        return <Listen verseString={verseString} />;
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
