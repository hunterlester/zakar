import React, { ReactElement } from 'react';
import './SearchResult.css';
import { useHistory } from 'react-router-dom';
import { fetchVerse } from 'utils/helpers';

interface Props {
  content: string;
  reference: string;
  isPassageEndpoint: boolean;
}

const SearchResult = (props: Props): ReactElement => {
  const { content, reference, isPassageEndpoint } = props;
  const history = useHistory();

  const verseHandler = (verseId: string) => {
    fetchVerse({ verseCanonical: verseId })
      .then((verseData) => {
        localStorage.setItem('verseString', verseData.passages[0]);
        localStorage.setItem('verseIDArray', JSON.stringify([verseData.parsed[0][0]]));
        history.push('/learning-board');
      })
      .catch((error) => {
        if (error.response && /login_cta/.test(error.response.headers.location)) {
          return history.push('/login-cta');
        }
        console.error(error);
      });
  };

  return (
    <div className="SearchResult">
      {!isPassageEndpoint && <h5>{reference}</h5>}
      <button className="SearchResultButton" onClick={() => verseHandler(reference)}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </button>
    </div>
  );
};

export default SearchResult;
