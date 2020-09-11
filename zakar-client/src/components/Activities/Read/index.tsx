import React, { ReactElement, useState, useEffect, useContext } from 'react';
import './Read.css';
import { StateContext } from 'StateProvider';

const Read = (): ReactElement => {
  const { verseText, setActivities, activities, verseCanonical } = useContext(StateContext);
  const [verseIndex, setVerseIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent): void => {
    const verseTextLength = verseText.split(' ').length;

    if (e.key === 'ArrowRight') {
      if (verseIndex < verseTextLength - 1) {
        setVerseIndex(verseIndex + 1);
      } else {
        setVerseIndex(0);
      }
    }
  };

  const handleRightScroll = (): void => {
    const verseTextLength = verseText.split(' ').length;
    if (verseIndex < verseTextLength - 1) {
      setVerseIndex(verseIndex + 1);
    } else {
      setVerseIndex(0);
    }
  };

  useEffect(() => {
    const verseTextLength = verseText.split(' ').length;
    if (verseIndex > 0 && verseIndex === verseTextLength - 1) {
      setActivities({ ...activities, Read: true });
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [verseIndex, verseText]);

  return (
    <>
      <h2 className="ReadingH2">{verseCanonical}</h2>
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
        <button onClick={handleRightScroll}>Tap me</button>
      </div>
    </>
  );
};

export default Read;
