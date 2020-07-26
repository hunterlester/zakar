import React, { ReactElement, useState, useEffect } from 'react';
import { PREFIX, BIBLE_ID } from 'utils/const';
import { useParams, Link, useLocation } from 'react-router-dom';
import './Verses.css';
import { LocationState } from 'react-app-env';

const Verses = (): ReactElement => {
  const { bookId, chapterId } = useParams();
  const { state } = useLocation<LocationState>();
  const [verses, setVerses] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setError('');
    fetch(`${PREFIX}/bibles/${BIBLE_ID}/chapters/${chapterId}/verses`, {
      headers: {
        'api-key': `${process.env.REACT_APP_BIBLE_API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.message);
        } else {
          setVerses(data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log('Verses: ', verses);

  return (
    <>
      <h2>
        {state.book} {state.chapter}
      </h2>
      <h2>Verses:</h2>
      <div className="VersesContainer">
        {verses.map((verse, i) => {
          return (
            <Link key={verse.id} className="Verse" to={`/book/${bookId}/chapter/${chapterId}/verse/${verse.id}`}>
              <h3>{i + 1}</h3>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Verses;
