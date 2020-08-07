import React, { ReactElement } from 'react';
import './Verse.css';

interface Props {
  verseString: string;
}

const Verse = (props: Props): ReactElement => {
  const { verseString } = props;

  return (
    <>
      <div className="VerseContainer">
        { /* <div>{verseString}</div> */ }
        <div dangerouslySetInnerHTML={{ __html: verseString }} />
      </div>
    </>
  );
};

export default Verse;
