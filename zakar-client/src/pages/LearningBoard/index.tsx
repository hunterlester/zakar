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
  const {activities, setActivities} = useContext(StateContext);
  const [activityState, setActivityState] = useState<Activities>(Activities.Build);
  const history = useHistory();
  const [verseString, setVerse] = useVerse('');

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
        return <Build verseString={verseString} setVerse={setVerse} setActivitiesStates={setActivities} />;
      case Activities.Read:
        return <Read setActivitiesStates={setActivities} />;
      case Activities.Type:
        return <Type verseString={verseString} setActivitiesStates={setActivities} />;
      case Activities.Listen:
        return <Listen verseString={verseString} setActivitiesStates={setActivities} />;
      case Activities.Complete:
        return <Complete verseString={verseString} setActivitiesStates={setActivities} />;
      case Activities.Recite:
        return <Recite verseString={verseString} setActivitiesStates={setActivities} />;
      default:
        return;
    }
  };

  useEffect(() => {
    const verses = JSON.parse(`${localStorage.getItem('verseIDArray')}`);

    if (!verses || !verses.length) {
      history.replace('/');
    }

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let activities = JSON.parse(`${localStorage.getItem('activities')}`);
    if (!activities) {
      Object.keys(Activities).forEach((activity: string) => {
        if (!Number.isInteger(Number(activity)) && activity) {
          activities = { ...activities, [activity]: activity === 'Build' ? true : false };
        }
      });

      localStorage.setItem('activities', JSON.stringify(activities));
    }
    setActivities(activities);
  }, []);

  // console.log('ACTIVITY STATE: ', activityState);

  return (
    <div {...handlers}>
      <ActivitiesBar
        activitiesStates={activities}
        activityState={activityState}
        setActivityState={setActivityState}
      />
      <ActivityInstruction instruction={ActivityInstructions[activityState]} />
      <div className="ActivityBlock">{activitySwitch(activityState)}</div>
    </div>
  );
};

export default LearningBoard;
