import React, { ReactElement, useState, FormEvent, useEffect, useRef } from 'react';
import SearchResult from 'components/Search/SearchResult';
import { SERVER_ORIGIN, defaultParams, IS_NODE_DEV, ESV_PREFIX } from 'utils/const';
import './Search.css';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { getCookie } from 'utils/helpers';
import { useHistory, useLocation } from 'react-router-dom';

interface SearchResult {
  content: string;
  reference: string;
}

const Search = (): ReactElement => {
  const history = useHistory();
  const location = useLocation();
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [error, setError] = useState('');
  const [isPassageEndpoint, setIsPassageEndpoint] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const submitInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('q');
    if (searchParam) {
      setSearchValue(searchParam);
      if (submitInputRef.current && searchValue) {
        submitInputRef.current.click();
        history.replace('/');
      }
    }
  }, [location, searchValue]);

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    setIsFetching(true);
    setError('');
    if (!!searchValue) {
      const isPassageEndpoint = /([a-z])+(\s*\d)/.test(searchValue);
      const requestHref = IS_NODE_DEV ? ESV_PREFIX : `${SERVER_ORIGIN}/proxy`;
      const headers = {
        Authorization: IS_NODE_DEV ? `Token ${process.env.REACT_APP_ESV_API_KEY}` : `Bearer ${getCookie('bearer')}`,
      };
      axios
        .get(`${requestHref}/${isPassageEndpoint ? 'html' : 'search'}/?q=${searchValue}`, {
          headers,
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
            results = response.data.results || [];
          }
          setSearchResult(results);
          setIsFetching(false);
        })
        .catch((error: AxiosError) => {
          setIsFetching(false);
          setError(error.message);
          setSearchResult([]);
          if (error.response && /login_cta/.test(error.response.headers.location)) {
            history.push('/login-cta');
          }
          console.error(error);
        });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          disabled={isFetching}
          autoFocus={true}
          placeholder="Try: gen1, gen1.3, gen1.3-7, jacob, job, jesus"
          className="SearchInput"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <input ref={submitInputRef} disabled={isFetching} className="SearchButton" type="submit" value="Search" />
      </form>
      {!!error && <div className="ErrorMessage">{error}</div>}
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
