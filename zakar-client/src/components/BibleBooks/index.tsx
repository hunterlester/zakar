import React, { ReactElement, useState, useEffect } from 'react';
import { PREFIX, BIBLE_ID } from 'utils/const';
import './BibleBooks.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BibleBooks = (): ReactElement => {
  const [bibleBooks, setBibleBooks] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  useEffect(() => {
    setError('');
    axios.get(`${PREFIX}/bibles/${BIBLE_ID}/books`, {
      cancelToken: source.token,
      headers: {
        'api-key': `${process.env.REACT_APP_BIBLE_API_KEY}`,
      },
    })
      .then((data) => {
        if (data.data.error) {
          setError(data.data.message);
        } else {
          setBibleBooks(data.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
      return () => {
        source.cancel('Operation canceled by unmounted component');
      };
  }, []);

  console.log('Books: ', bibleBooks);

  return (
    <div className="BibleBooksContainer">
      {bibleBooks.map((book) => {
        return (
          <Link
            key={book.id}
            className="Book"
            to={{
              pathname: `/book/${book.id}`,
              state: {
                book: book.name,
              },
            }}
          >
            <h3>{book.name}</h3>
            <h6>{book.nameLong}</h6>
          </Link>
        );
      })}
    </div>
  );
};

export default BibleBooks;
