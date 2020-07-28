import React, { ReactElement, useState, useEffect } from 'react';
import { PREFIX, BIBLE_ID } from 'utils/const';

const LearningBoard = (): ReactElement => {
  const [verseArray, setVerseArray] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const fetchVerse = (verseId: string): Promise<any> => {
    return fetch(`${PREFIX}/bibles/${BIBLE_ID}/verses/${verseId}`, {
      headers: {
        'api-key': `${process.env.REACT_APP_BIBLE_API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw data.message;
        } else {
          const _BAPI = window._BAPI || {};
          if (typeof _BAPI.t != undefined) {
            console.log('-- Calling BAPI.t with fums ID: ', data.meta.fumsId);
            _BAPI.t(data.meta.fumsId);
          }
          console.log('Verse data: ', data);
          return data.data;
        }
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  useEffect(() => {
    setError('');
    const verses = JSON.parse(`${localStorage.getItem('verses')}`);
    console.log('Local storage verse: ', verses);

    if (verses && Array.isArray(verses)) {
      verses.forEach(async (verseId) => {
        try {
          const verseData = await fetchVerse(verseId);
          console.log('Map verse data: ', verseData);
          setVerseArray((prevArray) => [...prevArray, verseData]);
        } catch (error) {
          setError(error);
        }
      });
    }
  }, []);

  console.log('Verse array: ', verseArray);

  return (
    <>
      {!!verseArray.length && verseArray[0].previous.id && (
        <button
          onClick={async () => {
            try {
              let verses = JSON.parse(`${localStorage.getItem('verses')}`);
              verses = [verseArray[0].previous.id, ...verses];
              localStorage.setItem('verses', JSON.stringify(verses));
              const verseData = await fetchVerse(verseArray[0].previous.id);
              setVerseArray((prevArray) => [verseData, ...prevArray]);
            } catch (error) {
              setError(error);
            }
          }}
        >
          Add Previous Verse
        </button>
      )}
      {verseArray.map((verse) => {
        return <div key={verse.id} className="VerseContainer" dangerouslySetInnerHTML={{ __html: verse.content }} />;
      })}
      {!!verseArray.length && verseArray[verseArray.length - 1].next.id && (
        <button
          onClick={async () => {
            try {
              const verses = JSON.parse(`${localStorage.getItem('verses')}`);
              verses.push(verseArray[0].next.id);
              localStorage.setItem('verses', JSON.stringify(verses));
              const verseData = await fetchVerse(verseArray[verseArray.length - 1].next.id);
              setVerseArray((prevArray) => [...prevArray, verseData]);
            } catch (error) {
              setError(error);
            }
          }}
        >
          Add Next Verse
        </button>
      )}
      {!!verseArray.length && verseArray[0].copyright && (
        <div className="VerseCopyright">{verseArray[0].copyright}</div>
      )}
    </>
  );
};

export default LearningBoard;
