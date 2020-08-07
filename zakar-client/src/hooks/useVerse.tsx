import React, { useState, useEffect } from 'react';
import { fetchVerse } from 'utils/helpers';
import { RequestFormat } from 'utils/const';

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
    const verseID = localStorage.getItem('verseID');

    if (!!verseID) {
      const fetchArgs = {
        verseID,
        format: RequestFormat.HTML,
        params: {
          'include-headings': false,
          'include-copyright': false,
          'include-short-copyright': true,
          'include-audio-link': false,
          'include-passage-references': true,
          'include-footnotes': false,
        },
      };
      console.log('VERSE ID TO FETCH: ', verseID);
      fetchVerse(fetchArgs)
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
