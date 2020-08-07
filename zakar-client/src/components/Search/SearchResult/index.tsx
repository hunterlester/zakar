import React, { ReactElement } from 'react';
import './SearchResult.css';
import { useHistory } from 'react-router-dom';

interface Props {
  text?: string;
  content?: string;
  id: string;
  reference: string;
}

const SearchResult = (props: Props): ReactElement => {
  const { text, content, id, reference } = props;
  const history = useHistory();

  const verseHandler = (verseId: string) => {
    const verseArray = verseId.split('-');
    localStorage.setItem('versesID', JSON.stringify(verseArray));
    history.push('/learning-board');
  };

  return (
    <div className="SearchResult">
      {text && <a onClick={() => verseHandler(id)}>{text}</a>}
      {content && (
        <a onClick={() => verseHandler(id)}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </a>
      )}
      <h5>
        {reference}({id})
      </h5>
    </div>
  );
};

export default SearchResult;
