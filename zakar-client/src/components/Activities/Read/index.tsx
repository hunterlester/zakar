import React, { ReactElement, useState, useEffect } from 'react';
import './Read.css';
import { ActivityProps } from 'react-app-env';

const Read = (props: ActivityProps): ReactElement => {
  const [verseText, setVerseText] = useState<string>('');
  const [verseIndex, setVerseIndex] = useState(0);
  const { setActivitiesStates } = props;

  useEffect(() => {
    const verseText = localStorage.getItem('verseText');
    if (!!verseText) {
      setVerseText(verseText);
    }
  }, []);

  const handleKeyDown = (e: KeyboardEvent): void => {
    const verseTextLength = verseText.split(' ').length;
    if (e.key === 'ArrowLeft') {
      if (verseIndex > 0) {
        setVerseIndex(verseIndex - 1);
      }
    }

    if (e.key === 'ArrowRight') {
      if (verseIndex < verseTextLength - 1) setVerseIndex(verseIndex + 1);
    }
  };

  const handleLeftScroll = (): void => {
    if (verseIndex > 0) {
      setVerseIndex(verseIndex - 1);
    }
  };

  const handleRightScroll = (): void => {
    // console.log('SCROOL RIGHT');
    const verseTextLength = verseText.split(' ').length;
    if (verseIndex < verseTextLength - 1) setVerseIndex(verseIndex + 1);
  };

  useEffect(() => {
    const verseTextLength = verseText.split(' ').length;
    if (verseIndex > 0 && verseIndex === verseTextLength - 1) {
      const activities = JSON.parse(`${localStorage.getItem('activities')}`);
      activities['Read'] = true;
      localStorage.setItem('activities', JSON.stringify(activities));
      setActivitiesStates(activities);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [verseIndex, verseText]);

  return (
    <>
      <h2 className="ReadingH2">{localStorage.getItem('verseID')}</h2>
      <div className="ReadingContainer">
        {verseText.split(' ').map((word, i) => {
          return (
            <span className={i === verseIndex ? 'VerseHighlight' : 'NonVerseHighlight'} key={word + i}>
              {word}
            </span>
          );
        })}
      </div>
      <div className="LeftRightButtonBlock">
        <button onClick={handleLeftScroll}>&#8592;</button>
        <button onClick={handleRightScroll}>&#8594;</button>
      </div>
    </>
  );
};

export default Read;
