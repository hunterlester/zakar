import React, { useState, useEffect } from 'react';
import { fetchVerse } from 'utils/helpers';

export default (state: any[]) => {
  const [verseArray, setVerseArray] = useState<any[]>(state);
  const [error, setError] = useState<string>('');

  const gatherText = () => {
    const text = document.querySelector('.VerseContainer');
    if (text && text.textContent) {
      localStorage.setItem('verseText', text.textContent);
    }
  };

  useEffect(() => {
    setError('');
    const verses = JSON.parse(`${localStorage.getItem('versesID')}`);
    console.log('Local storage verse: ', verses);

    if (!!verses && Array.isArray(verses)) {
      let verseId = `${verses[0]}-${verses[verses.length - 1]}`;
      if (verses.length === 1) {
        verseId = `${verses[0]}`;
      }
      console.log('VERSE ID TO FETCH: ', verseId);
      fetchVerse(verseId)
        .then((verseData) => {
          console.log('Map verse data: ', verseData);
          localStorage.setItem('verseData', JSON.stringify(verseData));
          setVerseArray((prevArray: string[]) => [...prevArray, verseData]);
        })
        .catch((error) => {
          setError(error);
        });
    }
  }, []);

  useEffect(() => {
    gatherText();
  }, [verseArray]);

  return [verseArray, setVerseArray] as const;
};
