import React, { ReactElement, useState, useEffect } from 'react';
import SearchResult from 'components/Search/SearchResult';
import { PREFIX, BIBLE_ID } from 'utils/const';
import './Search.css'

const Search = (): ReactElement => {
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
      setError('');
      if (!!searchValue) {
        fetch(`${PREFIX}/bibles/${BIBLE_ID}/search?query=${searchValue}`, {
            headers: {
                'api-key': `${process.env.REACT_APP_BIBLE_API_KEY}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
              setError(data.message);
            } else {
              if (data.data.verses) {
                setSearchResult(data.data.verses);
              } else if (data.data.passages) {
                setSearchResult(data.data.passages);
              }
            }
        })
        .catch((error) => {
            console.error(error);
        });
      }
  }, [searchValue]);

  return (
      <>
         <input className='SearchInput' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
         {!!error && <div>{error}</div>}
         <div className="SearchResultContainer">
           {searchResult.map(result => {
               return (<SearchResult key={result.id} text={result.text} content={result.content} />);
           })}
         </div>
      </>
  );
};

export default Search;