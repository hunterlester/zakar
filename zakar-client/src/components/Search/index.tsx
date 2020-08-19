import React, { ReactElement, useState, useEffect } from 'react';
import SearchResult from 'components/Search/SearchResult';
import { ESV_PREFIX, defaultParams } from 'utils/const';
import './Search.css';
import axios, { AxiosResponse } from 'axios';

interface SearchResult {
  content: string;
  reference: string;
}

const Search = (): ReactElement => {
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [error, setError] = useState('');
  const [isPassageEndpoint, setIsPassageEndpoint] = useState(false);

  useEffect(() => {
    setError('');
    if (!!searchValue) {
      const isPassageEndpoint = /([a-z])+(\s*\d)/.test(searchValue);

      axios
        .get(`/${isPassageEndpoint ? 'html' : 'search'}/?q=${searchValue}`, {
          headers: {
            Authorization: `Token ${process.env.REACT_APP_ESV_API_KEY}`,
          },
          params: defaultParams,
        })
        .then((response: AxiosResponse) => {
          let results;
          if (isPassageEndpoint) {
            setIsPassageEndpoint(true);
            results = [
              {
                reference: response.data.canonical,
                content: response.data.passages,
              },
            ];
          } else {
            setIsPassageEndpoint(false);
            results = response.data.results;
          }
          setSearchResult(results);
        })
        .catch((error) => {
          setError(error);
          console.error(error);
        });
    }
  }, [searchValue]);

  // console.log(searchResult);

  return (
    <>
      <input
        autoFocus={true}
        placeholder="Try: gen1, gen1.3, gen1.3, gen1.3-7, jacob, job, jesus"
        className="SearchInput"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {!!error && <div>{error}</div>}
      <div className="SearchResultContainer">
        {searchResult.map((result, i) => {
          return (
            <SearchResult
              key={`${result.reference}-${i}`}
              isPassageEndpoint={isPassageEndpoint}
              content={result.content}
              reference={result.reference}
            />
          );
        })}
      </div>
    </>
  );
};

export default Search;
