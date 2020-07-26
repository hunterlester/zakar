import React, { ReactElement, useState, useEffect } from 'react';
import { PREFIX, BIBLE_ID } from 'utils/const';
import './BibleBooks.css';
import { Link } from 'react-router-dom';

const BibleBooks = (): ReactElement => {
  const [bibleBooks, setBibleBooks]   = useState<any[]>([]);
  const [error, setError]             = useState<string>('');

  useEffect(() => {
      setError('');
      fetch(`${PREFIX}/bibles/${BIBLE_ID}/books`, {
          headers: {
              'api-key': `${process.env.REACT_APP_BIBLE_API_KEY}`
          }
      })
      .then(response => response.json())
      .then(data => {
          if (data.error) {
            setError(data.message);
          } else {
            setBibleBooks(data.data);
          }
      })
      .catch((error) => {
          console.error(error);
      });
  }, []);

  console.log('Books: ', bibleBooks);

  return (
    <div className="BibleBooksContainer">
      {bibleBooks.map(book => {
        return (
          <Link key={book.id} className="Book" to={{
            pathname: `/book/${book.id}`,
            state: {
              book: book.name,
            },
          }}>
            <h3>
              {book.name}
            </h3>
            <h6>
              {book.nameLong}
            </h6>
          </Link>
        );
      })}
    </div>
  );
};

export default BibleBooks;