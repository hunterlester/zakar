import React, { ReactElement } from 'react';
import './SearchResult.css';

interface Props {
  text: string;
}

const SearchResult = (props: Props): ReactElement => {
  const {text} = props;
  return (
      <div className="SearchResult">
        <a href='localhost:3030'>{text}</a> 
      </div>
  );
};

export default SearchResult;