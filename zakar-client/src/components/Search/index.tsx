import React, { ReactElement, useState, useEffect } from 'react';
import SearchResult from 'components/Search/SearchResult';
import { ESV_PREFIX } from 'utils/const';
import './Search.css';
import axios, { AxiosResponse } from 'axios';

const Search = (): ReactElement => {
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    if (!!searchValue) {
      axios
        .get(`${ESV_PREFIX}/search/?q=${searchValue}`, {
          headers: {
            Authorization: `Token ${process.env.REACT_APP_ESV_API_KEY}`,
          },
        })
        .then((response: AxiosResponse) => {
          setSearchResult(response.data.results);
        })
        .catch((error) => {
          setError(error);
          console.error(error);
        });
    }
  }, [searchValue]);

  console.log(searchResult);

  return (
    <>
      <input
        autoFocus={true}
        placeholder="gen 1, gen 1:3, gen 1:1-3, jacob"
        className="SearchInput"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {!!error && <div>{error}</div>}
      <div className="SearchResultContainer">
        {searchResult.map((result, i) => {
          return (
            <SearchResult key={`${result.reference}-${i}`} content={result.content} reference={result.reference} />
          );
        })}
      </div>
    </>
  );
};

export default Search;
