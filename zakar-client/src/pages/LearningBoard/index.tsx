import React, { ReactElement, useState, useEffect } from 'react';
import { PREFIX, BIBLE_ID } from 'utils/const';
import { useHistory } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

const LearningBoard = (): ReactElement => {
  const [verseArray, setVerseArray] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const history = useHistory();

  const fetchVerse = (verseId: string): Promise<any> => {
    return axios
      .get(`${PREFIX}/bibles/${BIBLE_ID}/verses/${verseId}`, {
        headers: {
          'api-key': `${process.env.REACT_APP_BIBLE_API_KEY}`,
        },
      })
      .then((data: AxiosResponse) => {
        if (data.data.error) {
          throw data.data.message;
        } else {
          const _BAPI = window._BAPI || {};
          if (typeof _BAPI.t != undefined) {
            console.log('-- Calling BAPI.t with fums ID: ', data.data.meta.fumsId);
            _BAPI.t(data.data.meta.fumsId);
          }
          console.log(' -- -- Verse data: ', data.data);
          return data.data.data;
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

    if (!!verses && Array.isArray(verses)) {
      let verseId = `${verses[0]}-${verses[verses.length - 1]}`;
      if (verses.length === 1) {
        verseId = `${verses[0]}`;
      }
      console.log('VERSE ID TO FETCH: ', verseId);
      fetchVerse(verseId)
        .then((verseData) => {
          console.log('Map verse data: ', verseData);
          setVerseArray((prevArray) => [...prevArray, verseData]);
        })
        .catch((error) => {
          setError(error);
        });
    } else {
      history.replace('/');
    }
  }, []);

  console.log('Verse array: ', verseArray);

  return (
    <>
      <button
        onClick={async () => {
          try {
            let verses = JSON.parse(`${localStorage.getItem('verses')}`);
            let verseData = await fetchVerse(verses[0]);
            verses = [verseData.previous.id, ...verses];
            localStorage.setItem('verses', JSON.stringify(verses));

            verseData = await fetchVerse(verseData.previous.id);
            if (verseData) {
              setVerseArray((prevArray) => [verseData, ...prevArray]);
            }
          } catch (error) {
            setError(error);
          }
        }}
      >
        Add Previous Verse
      </button>
      {verseArray.map((verse) => {
        return <div key={verse.id} className="VerseContainer" dangerouslySetInnerHTML={{ __html: verse.content }} />;
      })}
      <button
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

export default LearningBoard;
