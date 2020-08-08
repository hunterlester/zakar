import React, { ReactElement, useState, useEffect } from 'react';
import './Read.css';

const Read = (): ReactElement => {
  const [verseText, setVerseText] = useState<string>('');
  const [verseIndex, setVerseIndex] = useState(0);

  useEffect(() => {
    const verseText = localStorage.getItem('verseText');
    if (!!verseText) {
      setVerseText(verseText);
    }
  }, []);

  const handleKeyDown = (e: any): void => {
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
    console.log('SCROOL RIGHT');
    const verseTextLength = verseText.split(' ').length;
    if (verseIndex < verseTextLength - 1) setVerseIndex(verseIndex + 1);
  };

  useEffect(() => {
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
