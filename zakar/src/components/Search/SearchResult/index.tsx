import React, { ReactElement } from 'react';
import './SearchResult.css';

interface Props {
  text?: string;
  content?: string;
}

const SearchResult = (props: Props): ReactElement => {
  const {text, content} = props;
  return (
    <>
      {
        text && 
        (
          <div className="SearchResult">
            <a href='localhost:3030'>{text}</a> 
          </div>
        )
      }
      {
        content && (
          <div dangerouslySetInnerHTML={{__html: content}} />
        )
      }
    </>
  );
};

export default SearchResult;