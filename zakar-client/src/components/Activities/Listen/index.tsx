import React, { ReactElement, useEffect } from 'react';
import './Listen.css';
import { ActivityProps } from 'react-app-env';
import Verse from 'components/Verse';

const Listen = (props: ActivityProps): ReactElement => {
  const { verseString } = props;

  const audioEndedHandler = () => {
    const activities = JSON.parse(`${localStorage.getItem('activities')}`);
    activities['Listen'] = true;
    localStorage.setItem('activities', JSON.stringify(activities));
  };

  return (
    <div>
      <Verse verseString={verseString} />
      <audio
        onEnded={audioEndedHandler}
        className="VerseAudio"
        controls
        src={`https://audio.esv.org/hw/mq/${localStorage.getItem('verseID')}.mp3`}
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </div>
  );
};

export default Listen;
