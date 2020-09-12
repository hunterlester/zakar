import React, { ReactElement, useContext } from 'react';
import './Listen.css';
import Verse from 'components/Verse';
import Doodle from 'components/Doodle';
import { StateContext } from 'StateProvider';

const Listen = (): ReactElement => {
  const { verseString, setActivities, activities, verseCanonical } = useContext(StateContext);

  const audioEndedHandler = () => {
    setActivities({ ...activities, Listen: true });
  };

  return (
    <div>
      <audio
        onEnded={audioEndedHandler}
        className="VerseAudio"
        controls
        src={`https://audio.esv.org/hw/mq/${verseCanonical}.mp3`}
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
