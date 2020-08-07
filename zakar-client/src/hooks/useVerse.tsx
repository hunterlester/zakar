import React, { useState, useEffect } from 'react';
import { fetchVerse } from 'utils/helpers';

export default (state: string) => {
  const [verse, setVerse] = useState<string>(state);
  const [error, setError] = useState<string>('');

  const gatherText = () => {
    const text = document.querySelector('.VerseContainer');
    if (text && text.textContent) {
      localStorage.setItem('verseText', text.textContent);
    }
  };

  useEffect(() => {
    setError('');
    const verseId = localStorage.getItem('verseID');

    if (!!verseId) {
      console.log('VERSE ID TO FETCH: ', verseId);
      fetchVerse(verseId)
        .then((verseData) => {
          console.log('Map verse data: ', verseData);
          setVerse(verseData.passages[0]);
        })
        .catch((error) => {
          setError(error);
        });
    }
  }, []);

  useEffect(() => {
    gatherText();
  }, [verse]);

  return [verse, setVerse] as const;
};
