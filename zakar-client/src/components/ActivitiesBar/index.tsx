import React, { ReactElement } from 'react';
import { Activities } from 'utils/const';
import './ActivitiesBar.css';
import { useHistory } from 'react-router-dom';

interface Props {
  setActivityState: Function;
  activityState: Activities;
}

const ActivitiesBar = (props: Props): ReactElement => {
  const { setActivityState, activityState } = props;
  const history = useHistory();

  const setActivityNone = (): void => {
    setActivityState(Activities.Build);
  };

  const setActivityFocusedScroll = (): void => {
    setActivityState(Activities.Read);
  };

  const setActivityDoodlePad = (): void => {
    setActivityState(Activities.Doodle);
  };

  const setActivityRecite = (): void => {
    setActivityState(Activities.Recite);
  };

  const setActivityTyping = (): void => {
    setActivityState(Activities.Type);
  };

  const setActivityListening = (): void => {
    setActivityState(Activities.Listen);
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
      <button
        key="clear-verse"
        onClick={() => {
          localStorage.clear();
          history.push('/');
        }}
        className="ClearVerseButton"
      >
        Clear Verse
      </button>
    </div>
  );
};

export default ActivitiesBar;
