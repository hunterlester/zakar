import React, { ReactElement } from 'react';
import './Listen.css';
import { ActivityProps } from 'react-app-env';
import Verse from 'components/Verse';
import Doodle from 'components/Doodle';

const Listen = (props: ActivityProps): ReactElement => {
  const { verseString, setActivitiesStates } = props;

  const audioEndedHandler = () => {
    const activities = JSON.parse(`${localStorage.getItem('activities')}`);
    activities['Listen'] = true;
    localStorage.setItem('activities', JSON.stringify(activities));
    setActivitiesStates(activities);
  };

  return (
    <div>
      <audio
        onEnded={audioEndedHandler}
        className="VerseAudio"
        controls
        src={`https://audio.esv.org/hw/mq/${localStorage.getItem('verseCanonical')}.mp3`}
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>

      <Verse verseString={verseString} />

      <Doodle />
    </div>
  );
};

export default Listen;
