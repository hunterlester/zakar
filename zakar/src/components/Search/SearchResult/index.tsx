import React, { ReactElement } from 'react';
import './SearchResult.css';

interface Props {
  text?: string;
  content?: string;
  id: string;
  reference: string;
}

const SearchResult = (props: Props): ReactElement => {
  const {text, content, id, reference} = props;
  return (
    <div className="SearchResult">
      {
        text && 
        (
          <a href='localhost:3030'>{text}</a> 
        )
      }
      {
        content && (
          <div dangerouslySetInnerHTML={{__html: content}} />
        )
      }
      <h5>
        {reference}({id})
      </h5>
    </div>
  );
};

export default SearchResult;