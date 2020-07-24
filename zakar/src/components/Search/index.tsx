import React, { ReactElement, useState, useEffect } from 'react';
import SearchResult from 'components/Search/SearchResult';
import './Search.css'

const Search = (): ReactElement => {
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [error, setError] = useState('');
  const PREFIX = 'https://api.scripture.api.bible/v1';
  const BIBLE_ID= 'de4e12af7f28f599-01';

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
              setSearchResult(data.data.verses);
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
               return (<SearchResult key={result.id} text={result.text} />);
           })}
         </div>
      </>
  );
};

export default Search;