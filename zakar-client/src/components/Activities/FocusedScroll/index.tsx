import React, { ReactElement, useState, useEffect } from 'react';
import './FocusedScroll.css';

const FocusedScroll = (): ReactElement => {
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
      if (verseIndex < verseTextLength - 2) setVerseIndex(verseIndex + 1);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [verseIndex, verseText]);

  return (
    <div>
      {verseText.split(' ').map((word, i) => {
        return (
          <span className={i === verseIndex ? 'VerseHighlight' : ''} key={word + i}>
            {word}
          </span>
        );
      })}
    </div>
  );
};

export default FocusedScroll;
