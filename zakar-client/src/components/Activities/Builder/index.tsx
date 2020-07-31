import React, { ReactElement, useEffect, useState } from 'react';
import { fetchVerse } from 'utils/helpers';
import './Builder.css';

const Builder = (): ReactElement => {
  const [verseArray, setVerseArray] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const gatherText = () => {
    const text = document.querySelector('.VerseContainer');
    if (text && text.textContent) {
      localStorage.setItem('verseText', text.textContent);
    }
  };

  useEffect(() => {
    setError('');
    const verses = JSON.parse(`${localStorage.getItem('verses')}`);
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
          setVerseArray((prevArray: string[]) => [...prevArray, verseData]);
          gatherText();
        })
        .catch((error) => {
          setError(error);
        });
    }
  }, []);

  return (
    <>
      <button
        className="LearningBoardButton"
        onClick={async () => {
          try {
            let verses = JSON.parse(`${localStorage.getItem('verses')}`);
            let verseData = await fetchVerse(verses[0]);
            verses = [verseData.previous.id, ...verses];
            localStorage.setItem('verses', JSON.stringify(verses));

            verseData = await fetchVerse(verseData.previous.id);
            if (verseData) {
              setVerseArray((prevArray: string[]) => [verseData, ...prevArray]);
            }
          } catch (error) {
            setError(error);
          }
        }}
      >
        Add Previous Verse
      </button>
      <div className="VerseContainer">
        {verseArray.map((verse) => {
          return <div key={verse.id} dangerouslySetInnerHTML={{ __html: verse.content }} />;
        })}
      </div>
      <button
        className="LearningBoardButton"
        onClick={async () => {
          try {
            let verses = JSON.parse(`${localStorage.getItem('verses')}`);
            let verseData = await fetchVerse(verses[verses.length - 1]);
            verses = [...verses, verseData.next.id];
            localStorage.setItem('verses', JSON.stringify(verses));

            verseData = await fetchVerse(verseData.next.id);
            if (verseData) {
              setVerseArray((prevArray) => [...prevArray, verseData]);
            }
          } catch (error) {
            setError(error);
          }
        }}
      >
        Add Next Verse
      </button>
      {verseArray.length && <div className="VerseCopyright">{verseArray[0].copyright}</div>}
    </>
  );
};

export default Builder;
