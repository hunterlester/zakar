import React, { ReactElement, useState, useEffect } from 'react';
import { PREFIX, BIBLE_ID } from 'utils/const';
import { useParams } from 'react-router-dom';
import './Verse.css';

const Verse = (): ReactElement => {
  const { verseId } = useParams();
  const [verse, setVerse] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setError('');
    fetch(`${PREFIX}/bibles/${BIBLE_ID}/verses/${verseId}`, {
      headers: {
        'api-key': `${process.env.REACT_APP_BIBLE_API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.message);
        } else {
          setVerse(data.data.content);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <div className="VerseContainer" dangerouslySetInnerHTML={{ __html: verse }} />;
};

export default Verse;
