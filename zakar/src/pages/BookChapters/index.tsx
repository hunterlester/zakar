import React, { ReactElement, useState, useEffect } from 'react';
import { PREFIX, BIBLE_ID } from 'utils/const';
import { useParams, Link, useLocation } from 'react-router-dom';
import './BookChapters.css';
import { LocationState } from 'react-app-env';

const BookChapters = (): ReactElement => {
  const { bookId } = useParams();
  const { state } = useLocation<LocationState>();
  const [bookChapters, setBookChapters] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setError('');
    fetch(`${PREFIX}/bibles/${BIBLE_ID}/books/${bookId}/chapters`, {
      headers: {
        'api-key': `${process.env.REACT_APP_BIBLE_API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.message);
        } else {
          setBookChapters(data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log('Chapters: ', bookChapters);

  return (
    <>
      <h2>{state.book}</h2>
      <h2>Chapters:</h2>
      <div className="BookChaptersContainer">
        {bookChapters.slice(1).map((chapter) => {
          return (
            <Link
              key={chapter.id}
              className="Chapter"
              to={{
                pathname: `/book/${bookId}/chapter/${chapter.id}`,
                state: {
                  ...state,
                  chapter: chapter.number,
                },
              }}
            >
              <h3>{chapter.number}</h3>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default BookChapters;
