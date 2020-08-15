import React, { ReactElement, useState, useEffect } from 'react';
import SearchResult from 'components/Search/SearchResult';
import { ESV_PREFIX } from 'utils/const';
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

  useEffect(() => {
    setError('');
    if (!!searchValue) {
      const isPassageEndpoint = /([a-z])+(\s*\d)/.test(searchValue);
      const params = {
        'include-headings': false,
        'include-copyright': false,
        'include-short-copyright': false,
        'include-audio-link': false,
        'include-passage-references': true,
        'include-footnotes': false,
      };

      axios
        .get(`${ESV_PREFIX}/${isPassageEndpoint ? 'html' : 'search'}/?q=${searchValue}`, {
          headers: {
            Authorization: `Token ${process.env.REACT_APP_ESV_API_KEY}`,
          },
          params,
        })
        .then((response: AxiosResponse) => {
          let results;
          if (isPassageEndpoint) {
            results = [
              {
                reference: response.data.canonical,
                content: response.data.passages,
              },
            ];
          } else {
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
            <SearchResult key={`${result.reference}-${i}`} content={result.content} reference={result.reference} />
          );
        })}
      </div>
    </>
  );
};

export default Search;
