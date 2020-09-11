import React, { ReactElement } from 'react';
import './Verse.css';

interface Props {
  verseString: string;
}

const Verse = ({verseString}: Props): ReactElement => {

  return (
    <>
      <div className="VerseContainer">{verseString && <div dangerouslySetInnerHTML={{ __html: verseString }} />}</div>
    </>
  );
};

export default Verse;
