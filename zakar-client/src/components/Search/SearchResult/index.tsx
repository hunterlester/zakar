import React, { ReactElement } from 'react';
import './SearchResult.css';
import { useHistory } from 'react-router-dom';
import { fetchVerse } from 'utils/helpers';

interface Props {
  content: string;
  reference: string;
}

const SearchResult = (props: Props): ReactElement => {
  const { content, reference } = props;
  const history = useHistory();

  const verseHandler = (verseId: string) => {
    fetchVerse({ verseCanonical: verseId })
      .then((verseData) => {
        localStorage.setItem('verseString', verseData.passages[0]);
        localStorage.setItem('verseIDArray', JSON.stringify([verseData.parsed[0][0]]));
        history.push('/learning-board');
      })
      .catch(console.error);
  };

  return (
    <div className="SearchResult">
      <a onClick={() => verseHandler(reference)}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </a>
      <h5>{reference}</h5>
    </div>
  );
};

export default SearchResult;
