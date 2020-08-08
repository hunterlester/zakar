import React, { ReactElement } from 'react';
import './Listen.css';
import { ActivityProps } from 'react-app-env';
import Verse from 'components/Verse';

const Listen = (props: ActivityProps): ReactElement => {
  const { verseString } = props;

  return (
    <div>
      <Verse verseString={verseString} />
      <audio className="VerseAudio" controls src={`https://audio.esv.org/hw/mq/${localStorage.getItem('verseID')}.mp3`}>
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </div>
  );
};

export default Listen;
