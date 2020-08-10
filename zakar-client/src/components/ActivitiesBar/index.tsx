import React, { ReactElement, useEffect } from 'react';
import { Activities } from 'utils/const';
import './ActivitiesBar.css';

interface Props {
  setActivityState: Function;
  activityState: Activities;
}

const ActivitiesBar = (props: Props): ReactElement => {
  const { setActivityState, activityState } = props;

  useEffect(() => {
    const activities = localStorage.getItem('activities');
    if (!activities) {
      let activities = {};
      {
        Object.keys(Activities).forEach((activity: any) => {
          if (!Number.isInteger(Number(activity)) && activity) {
            const index: any = Activities[activity];
            activities = { ...activities, [activity]: activity === 'Build' ? true : false };
          }
        });
      }
      localStorage.setItem('activities', JSON.stringify(activities));
    }
  }, []);

  const setActivityBuild = (): void => {
    setActivityState(Activities.Build);
  };

  const setActivityRead = (): void => {
    setActivityState(Activities.Read);
  };

  const setActivityDoodle = (): void => {
    setActivityState(Activities.Doodle);
  };

  const setActivityRecite = (): void => {
    setActivityState(Activities.Recite);
  };

  const setActivityType = (): void => {
    setActivityState(Activities.Type);
  };

  const setActivityListen = (): void => {
    setActivityState(Activities.Listen);
  };

  const activityArray = [
    setActivityBuild,
    setActivityRead,
    setActivityDoodle,
    setActivityRecite,
    setActivityType,
    setActivityListen,
  ];

  return (
    <div className="ActivitiesBar">
      {Object.keys(Activities).map((activity: any) => {
        if (!Number.isInteger(Number(activity)) && activity) {
          const index: any = Activities[activity];
          return (
            <button
              key={activity}
              onClick={activityArray[index]}
              className={`ActivityItem ${activity} ${activityState === index ? 'Active' : ''}`}
            >
              {activity}
            </button>
          );
        }
      })}
    </div>
  );
};

export default ActivitiesBar;
