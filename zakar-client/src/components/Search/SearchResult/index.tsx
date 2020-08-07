import React, { ReactElement } from 'react';
import './SearchResult.css';
import { useHistory } from 'react-router-dom';

interface Props {
  content: string;
  reference: string;
}

const SearchResult = (props: Props): ReactElement => {
  const { content, reference } = props;
  const history = useHistory();

  const verseHandler = (verseId: string) => {
    localStorage.setItem('verseID', verseId);
    history.push('/learning-board');
  };

  return (
    <div className="SearchResult">
      <a onClick={() => verseHandler(reference)}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </a>
      <h5>
        {reference}
      </h5>
    </div>
  );
};

export default SearchResult;
