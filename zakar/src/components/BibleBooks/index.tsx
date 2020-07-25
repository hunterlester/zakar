import React, { ReactElement, useState, useEffect } from 'react';
import { PREFIX, BIBLE_ID } from 'utils/const';
import './BibleBooks.css';

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

  return (
    <div className="BibleBooksContainer">
      {bibleBooks.map(book => {
        return (
          <h3 className="Book">
            {book.name}
          </h3>
        );
      })}
    </div>
  );
};

export default BibleBooks;