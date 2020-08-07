import React, { ReactElement } from 'react';
import { Activities } from 'utils/const';
import './ActivitiesBar.css';

interface Props {
  setActivityState: Function;
}

const ActivitiesBar = (props: Props): ReactElement => {
  const { setActivityState } = props;

  const setActivityNone = (): void => {
    setActivityState(Activities.Builder);
  };

  const setActivityFocusedScroll = (): void => {
    setActivityState(Activities.FocusedScroll);
  };

  const setActivityDoodlePad = (): void => {
    setActivityState(Activities.DoodlePad);
  };

  const setActivityRecite = (): void => {
    setActivityState(Activities.Recite);
  };

  const setActivityTyping = (): void => {
    setActivityState(Activities.Typing);
  };

  const setActivityListening = (): void => {
    setActivityState(Activities.Listening);
  };

  const activityArray = [
    setActivityNone,
    setActivityFocusedScroll,
    setActivityDoodlePad,
    setActivityRecite,
    setActivityTyping,
    setActivityListening,
  ];

  return (
    <div className="ActivitiesBar">
      {Object.keys(Activities).map((activity: any) => {
        if (!Number.isInteger(Number(activity)) && activity) {
          const index: any = Activities[activity];
          return (
            <button key={activity} onClick={activityArray[index]} className={`ActivityItem ${activity}`}>
              {activity}
            </button>
          );
        }
      })}
    </div>
  );
};

export default ActivitiesBar;
