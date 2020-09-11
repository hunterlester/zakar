import React, { ReactElement, useState, useEffect, useContext } from 'react';
import { Activities, ActivityInstructions } from 'utils/const';
import { useHistory } from 'react-router-dom';
import ActivitiesBar from 'components/ActivitiesBar';
import './LearningBoard.css';
import Recite from 'components/Activities/Recite';
import Read from 'components/Activities/Read';
import Type from 'components/Activities/Type';
import Build from 'components/Activities/Build';
import useVerse from 'hooks/useVerse';
import Listen from 'components/Activities/Listen';
import { useSwipeable, EventData } from 'react-swipeable';
import ActivityInstruction from 'components/ActivityInstruction';
import Complete from 'components/Activities/Complete';
import { StateContext } from 'StateProvider';

const LearningBoard = (): ReactElement => {
  const { activities, verseIDArray } = useContext(StateContext);
  const [activityState, setActivityState] = useState<Activities>(Activities.Build);
  const history = useHistory();
  useVerse();

  const swipeEventHandler = (eventData: EventData) => {
    // console.log('SWIPE EVENT: ', eventData);
    const velocity = eventData.velocity;
    if (velocity < 0.7) {
      return;
    }
    const target: EventTarget | null = eventData.event.target;
    if ((target as HTMLElement).tagName === 'CANVAS' || (target as HTMLElement).tagName === 'TEXTAREA') {
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
        return <Build />;
      case Activities.Read:
        return <Read />;
      case Activities.Type:
        return <Type />;
      case Activities.Listen:
        return <Listen />;
      case Activities.Complete:
        return <Complete />;
      case Activities.Recite:
        return <Recite />;
      default:
        return;
    }
  };

  useEffect(() => {
    if (!verseIDArray || !verseIDArray.length) {
      history.replace('/');
    }

    window.scrollTo(0, 0);
  }, []);

  return (
    <div {...handlers}>
      <ActivitiesBar activitiesStates={activities} activityState={activityState} setActivityState={setActivityState} />
      <ActivityInstruction instruction={ActivityInstructions[activityState]} />
      <div className="ActivityBlock">{activitySwitch(activityState)}</div>
    </div>
  );
};

export default LearningBoard;
