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
import { useSwipeable } from 'react-swipeable';

const LearningBoard = (): ReactElement => {
  const [activityState, setActivityState] = useState<Activities>(Activities.Build);
  const history = useHistory();
  const [verseString, setVerse] = useVerse('');

  const swipeEventHandler = (eventData: any) => {
    console.log('SWIPE EVENT: ', eventData);
    const velocity = eventData.velocity;
    if (velocity < 0.7) {
      return;
    }
    if (eventData.event.target.tagName === 'CANVAS' || eventData.event.target.tagName === 'TEXTAREA') {
      return;
    }
    const enumLength = Object.keys(Activities).length / 2;
    if (eventData.dir === 'Left' && activityState + 1 < enumLength) {
      setActivityState(activityState + 1);
    }
    if (eventData.dir === 'Right' && activityState > 0) {
      setActivityState(activityState - 1);
    }
  };

  const handlers = useSwipeable({ onSwiped: (eventData) => swipeEventHandler(eventData) });

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
    <div {...handlers}>
      <ActivitiesBar activityState={activityState} setActivityState={setActivityState} />
      <div className="ActivityBlock">{activitySwitch(activityState)}</div>
    </div>
  );
};

export default LearningBoard;
