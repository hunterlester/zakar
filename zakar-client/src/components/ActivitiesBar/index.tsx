import React, { ReactElement, Dispatch, SetStateAction } from 'react';
import { Activities } from 'utils/const';
import './ActivitiesBar.css';
import { ActivitiesStates } from 'react-app-env';

interface Props {
  setActivityState: Dispatch<SetStateAction<Activities>>;
  activityState: Activities;
  activitiesStates: ActivitiesStates;
}

const ActivitiesBar = (props: Props): ReactElement => {
  const { setActivityState, activityState, activitiesStates } = props;

  const setActivityBuild = (): void => {
    setActivityState(Activities.Build);
  };

  const setActivityRead = (): void => {
    setActivityState(Activities.Read);
  };

  const setActivityType = (): void => {
    setActivityState(Activities.Type);
  };

  const setActivityListen = (): void => {
    setActivityState(Activities.Listen);
  };

  const setActivityComplete = (): void => {
    setActivityState(Activities.Complete);
  };

  const setActivityRecite = (): void => {
    setActivityState(Activities.Recite);
  };

  const activityArray = [
    setActivityBuild,
    setActivityRead,
    setActivityType,
    setActivityListen,
    setActivityComplete,
    setActivityRecite,
  ];

  return (
    <div className="ActivitiesBar">
      {Object.keys(Activities).map((activity: any) => {
        if (!Number.isInteger(Number(activity)) && activity) {
          const index: any = Activities[activity];
          const BoolProgress: boolean = activitiesStates[activity as keyof ActivitiesStates];
          return (
            <button
              key={activity}
              onClick={activityArray[index]}
              className={`ActivityItem ${activity} ${activityState === index ? 'Active' : ''} ${
                BoolProgress && activity !== 'Build' ? 'GreenState' : ''
              }`}
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
