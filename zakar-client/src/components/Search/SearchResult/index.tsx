import React, { ReactElement, useContext } from 'react';
import './SearchResult.css';
import { useHistory } from 'react-router-dom';
import { fetchVerse } from 'utils/helpers';
import { StateContext } from 'StateProvider';

interface Props {
  content: string;
  reference: string;
  isPassageEndpoint: boolean;
}

const SearchResult = (props: Props): ReactElement => {
  const { setVerseArray, setVerseString, setStandardFetchState } = useContext(StateContext);
  const { content, reference, isPassageEndpoint } = props;
  const history = useHistory();

  const verseHandler = (verseId: string) => {
    fetchVerse({ verseCanonical: verseId })
      .then((verseData) => {
        setStandardFetchState(verseData);
        setVerseString(verseData.passages[0]);
        setVerseArray([JSON.stringify(verseData.parsed[0][0])]);
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
